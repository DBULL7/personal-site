import { readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import assert from 'node:assert/strict'

const [
  base = 'http://localhost:4310',
  tooling = '/tmp/signal-tooling',
  mode = 'generate'
] = process.argv.slice(2)
const require = createRequire(resolve(tooling, 'package.json'))
const source = await readFile(
  new URL('../content/signal.json', import.meta.url)
)
const signal = JSON.parse(source)
assert.equal(signal.publication, 'approved')
const pdfPath = new URL('../public/resume.pdf', import.meta.url)
const manifestPath = new URL('../content/resume-manifest.json', import.meta.url)
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')

if (mode === 'generate') {
  const { chromium } = require('playwright')
  const browser = await chromium.launch({ channel: 'chrome', headless: true })
  try {
    const page = await browser.newPage()
    const response = await page.goto(new URL('/resume', base).href, {
      waitUntil: 'networkidle'
    })
    assert.equal(response.status(), 200)
    await page.emulateMedia({ media: 'print' })
    await page.pdf({
      path: pdfPath.pathname,
      format: 'A4',
      printBackground: true,
      margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' },
      tagged: true
    })
  } finally {
    await browser.close()
  }
} else {
  assert.equal(mode, 'check', 'mode is generate or check')
}

const bytes = await readFile(pdfPath)
const pdfjs = await import(
  pathToFileURL(require.resolve('pdfjs-dist/legacy/build/pdf.mjs')).href
)
const loadingTask = pdfjs.getDocument({
  data: new Uint8Array(bytes),
  useSystemFonts: true
})
const document = await loadingTask.promise
let text = ''
for (let i = 1; i <= document.numPages; i++) {
  const page = await document.getPage(i)
  const content = await page.getTextContent()
  text +=
    content.items.map((item) => ('str' in item ? item.str : '')).join(' ') +
    '\n'
}
const normalize = (value) => value.replace(/\s+/g, ' ').trim()
const actual = normalize(text)
const expected = [
  signal.person.name,
  signal.person.title,
  signal.person.employer,
  signal.person.tenure,
  signal.person.introduction,
  signal.person.site,
  signal.person.contact,
  ...signal.work.flatMap((work) => [
    work.title,
    work.client,
    work.period,
    work.role,
    work.contribution,
    ...work.highlights
  ]),
  ...signal.education.flatMap((entry) => [
    entry.school,
    entry.study,
    entry.year
  ])
]
for (const value of expected)
  assert.ok(
    actual.includes(normalize(value)),
    `PDF missing approved text: ${value}`
  )
assert.doesNotMatch(
  actual,
  /\d+(?:\.\d+)?%|\$\s*\d|\b\d+(?:\.\d+)?M\b|TODO|\.docx\b|PRIVATE_DRAFT|embedded systems/i
)
const manifest = {
  contentSha256: hash(source),
  pdfSha256: hash(bytes),
  pages: document.numPages
}
if (mode === 'generate')
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
else
  assert.deepEqual(
    JSON.parse(await readFile(manifestPath, 'utf8')),
    manifest,
    'regenerate PDF after content edits'
  )
await loadingTask.destroy()
console.log(
  JSON.stringify(
    { result: 'PASS', textChecks: expected.length, ...manifest },
    null,
    2
  )
)
