import assert from 'node:assert/strict'

const base = new URL(process.argv[2] || 'http://localhost:4310')
const results = []
const routes = [
  '/',
  '/career',
  '/work/cloud-console',
  '/resume',
  '/lab',
  '/blog',
  '/blog/crash-course-christmas-light-show-2023'
]
const forbidden =
  /embedded systems|\bTODO\b|\bStaff Engineer\b|\d+(?:\.\d+)?%|\$\s*\d|\b\d+(?:\.\d+)?M\b|\.docx\b|PRIVATE_DRAFT/i
const documents = new Map()

for (const path of routes) {
  try {
    const response = await fetch(new URL(path, base))
    assert.equal(response.status, 200, `${path} status`)
    assert.match(response.headers.get('content-type') || '', /text\/html/)
    const html = await response.text()
    documents.set(path, html)
    if (['/', '/career', '/work/cloud-console', '/resume'].includes(path)) {
      assert.doesNotMatch(
        text(path),
        forbidden,
        `${path} withheld or obsolete content`
      )
      assert.doesNotMatch(html, /\.docx\b|PRIVATE_DRAFT|embedded systems/i)
      assert.match(html, /<h1[\s>]/, `${path} primary heading`)
      assert.match(
        html,
        /rel="canonical"[^>]*devonbull\.com|devonbull\.com[^>]*rel="canonical"/,
        `${path} canonical`
      )
    }
    results.push({ check: path, result: 'PASS' })
  } catch (error) {
    results.push({ check: path, result: 'FAIL', message: error.message })
  }
}

function check(name, fn) {
  try {
    fn()
    results.push({ check: name, result: 'PASS' })
  } catch (error) {
    results.push({ check: name, result: 'FAIL', message: error.message })
  }
}

function text(path) {
  return (documents.get(path) || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
}

check('homepage initial HTML', () => {
  assert.match(text('/'), /Devon Bull/)
  assert.match(text('/'), /Solutions Architect/)
  assert.match(text('/'), /cloud console|cloud-console|Angular/i)
  assert.match(text('/'), /Chick-fil-A/)
  assert.match(
    documents.get('/') || '',
    /https:\/\/www.linkedin.com\/in\/bulldevon/
  )
  assert.match(documents.get('/') || '', /href="\/resume.pdf"/)
  assert.match(documents.get('/') || '', /href="\/work\/cloud-console"/)
})
check('career initial HTML', () => {
  for (const term of [
    'Big Nerd Ranch',
    'Apple',
    'Chick-fil-A',
    '2018',
    '2020',
    '2022',
    '2024',
    'LLM chat interface',
    'Backend lead'
  ])
    assert.ok(text('/career').includes(term), term)
})
check('case study depth', () => {
  for (const term of [
    'Angular',
    'React',
    'architecture',
    'legacy',
    'July 2022',
    'October 2024'
  ])
    assert.ok(text('/work/cloud-console').includes(term), term)
})

for (const [path, type] of [
  ['/resume.pdf', /application\/pdf/],
  ['/sitemap.xml', /xml/],
  ['/robots.txt', /text\/plain/]
]) {
  try {
    const response = await fetch(new URL(path, base))
    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type') || '', type)
    if (path.endsWith('.pdf')) {
      const bytes = Buffer.from(await response.arrayBuffer())
      assert.equal(bytes.subarray(0, 5).toString(), '%PDF-')
      assert.ok(bytes.length > 1000)
    } else if (path.includes('sitemap')) {
      const xml = await response.text()
      for (const required of [
        'https://devonbull.com',
        '/career',
        '/work/cloud-console'
      ])
        assert.ok(xml.includes(required), required)
      for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
        const url = new URL(match[1])
        assert.equal(url.origin, 'https://devonbull.com')
        const target = await fetch(new URL(url.pathname, base), {
          redirect: 'manual'
        })
        assert.equal(target.status, 200, `sitemap ${url.pathname}`)
      }
    } else {
      assert.match(await response.text(), /Disallow: \/blog/)
    }
    results.push({ check: path, result: 'PASS' })
  } catch (error) {
    results.push({ check: path, result: 'FAIL', message: error.message })
  }
}
try {
  const response = await fetch(new URL('/systems', base), {
    redirect: 'manual'
  })
  assert.ok([301, 302, 307, 308].includes(response.status))
  assert.match(response.headers.get('location') || '', /\/career$/)
  results.push({ check: '/systems redirect', result: 'PASS' })
} catch (error) {
  results.push({
    check: '/systems redirect',
    result: 'FAIL',
    message: error.message
  })
}
console.log(JSON.stringify({ base: base.href, results }, null, 2))
process.exitCode = results.some((result) => result.result === 'FAIL') ? 1 : 0
