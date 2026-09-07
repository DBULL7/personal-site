import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import assert from 'node:assert/strict'

const [
  base = 'http://localhost:4310',
  output = '/tmp/signal-checks',
  tooling = '/tmp/signal-tooling',
  mode = 'candidate'
] = process.argv.slice(2)
const require = createRequire(resolve(tooling, 'package.json'))
const { chromium } = require('playwright')
const { default: AxeBuilder } = require('@axe-core/playwright')
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = []
const context = await browser.newContext({
  reducedMotion: 'reduce',
  colorScheme: 'dark'
})
const page = await context.newPage()
const errors = []
page.on('pageerror', (error) => errors.push(error.message))

async function check(name, fn) {
  try {
    const detail = await fn()
    results.push({ check: name, result: 'PASS', detail })
  } catch (error) {
    results.push({ check: name, result: 'FAIL', message: error.message })
  }
}

const paths =
  mode === 'baseline'
    ? ['/']
    : ['/', '/career', '/work/cloud-console', '/resume', '/lab', '/blog']
for (const path of paths) {
  for (const width of [390, 768, 1440]) {
    await check(`${path} at ${width}px`, async () => {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto(new URL(path, base).href, { waitUntil: 'networkidle' })
      const label = path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')
      await page.screenshot({
        path: resolve(output, `${label}-${width}.png`),
        fullPage: true
      })
      assert.ok(
        (await page.locator('h1').innerText()).length > 1,
        'nonempty heading'
      )
      const dimensions = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        viewport: innerWidth
      }))
      assert.ok(
        dimensions.scroll <= dimensions.viewport + 1,
        JSON.stringify(dimensions)
      )
      if (mode !== 'baseline' && width === 390) {
        const audit = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze()
        await writeFile(
          resolve(output, `${label}-axe.json`),
          JSON.stringify(audit.violations, null, 2)
        )
        assert.equal(
          audit.violations.length,
          0,
          audit.violations
            .map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)
            .join('; ')
        )
      }
      return dimensions
    })
  }
}

await check('keyboard skip link', async () => {
  await page.goto(base)
  await page.keyboard.press('Tab')
  const focus = await page.evaluate(() => ({
    text: document.activeElement?.textContent,
    outline: getComputedStyle(document.activeElement).outlineStyle
  }))
  assert.match(focus.text || '', /Skip to content/)
  assert.notEqual(focus.outline, 'none')
  await page.keyboard.press('Enter')
  assert.equal(
    await page.evaluate(() => document.activeElement?.id),
    'main-content'
  )
  return focus
})

await check('200% zoom equivalent reflow', async () => {
  await page.setViewportSize({ width: 720, height: 500 })
  await page.goto(base)
  const ratio = await page.evaluate(
    () => document.documentElement.scrollWidth / innerWidth
  )
  assert.ok(ratio <= 1.01)
  return {
    effectiveViewport: 720,
    ratio,
    note: '1440px viewport at 200% equivalent CSS width; browser zoom shortcut checked separately'
  }
})

const noJs = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 390, height: 1000 }
})
const plain = await noJs.newPage()
for (const path of mode === 'baseline'
  ? ['/']
  : ['/', '/career', '/work/cloud-console']) {
  await check(`${path} without JavaScript`, async () => {
    await plain.goto(new URL(path, base).href)
    const body = await plain.locator('body').innerText()
    assert.ok(body.length > 100)
    if (mode !== 'baseline') {
      assert.match(body, /Devon Bull/)
      assert.match(body, /architecture/i)
      assert.ok(
        await plain
          .locator('a[href="https://www.linkedin.com/in/bulldevon"]')
          .count()
      )
      for (const href of await plain
        .locator('main a')
        .evaluateAll((links) =>
          links.map((link) => link.getAttribute('href'))
        )) {
        if (!href?.startsWith('/')) continue
        const response = await plain.request.get(new URL(href, base).href)
        assert.equal(response.status(), 200, href)
        if (href.includes('#')) {
          const target = await noJs.newPage()
          await target.goto(new URL(href, base).href)
          assert.ok(
            await target.locator(`[id="${href.split('#')[1]}"]`).count(),
            href
          )
          await target.close()
        }
      }
    }
    await plain.screenshot({
      path: resolve(
        output,
        `${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}-nojs.png`
      ),
      fullPage: true
    })
    return { textLength: body.length }
  })
}
await check('graphics unavailable', async () => {
  await page.route(/\.(svg|png|webp|jpe?g)(\?|$)/, (route) => route.abort())
  await page.goto(base)
  await page.addStyleTag({
    content:
      'svg, canvas, img { visibility: hidden !important; } * { background-image: none !important; }'
  })
  const body = await page.locator('body').innerText()
  assert.match(body, /Devon Bull/)
  if (mode !== 'baseline') assert.match(body, /Solutions Architect/)
  await page.screenshot({
    path: resolve(output, 'home-no-graphics.png'),
    fullPage: true
  })
})
await check('uncaught browser errors', () => assert.deepEqual(errors, []))
await browser.close()
await writeFile(
  resolve(output, 'browser-results.json'),
  JSON.stringify({ base, mode, results }, null, 2)
)
console.log(JSON.stringify(results, null, 2))
process.exitCode = results.some((result) => result.result === 'FAIL') ? 1 : 0
