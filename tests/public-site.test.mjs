import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import test from 'node:test'

const origin = process.env.PUBLIC_SITE_TEST_URL ?? 'http://127.0.0.1:3100'
const get = (path) => fetch(new URL(path, origin))

test('agent exports are readable and cite existing work sections', async () => {
  const response = await get('/profile.json')
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type'), /application\/json/)
  const profile = await response.json()
  assert.equal(profile.schemaVersion, '1.0')
  assert.equal(profile.employer, 'Big Nerd Ranch')
  assert.equal(profile.sourceType, 'self-reported portfolio')
  assert.ok(profile.engagements.length > 0)
  assert.equal(
    new Set(profile.engagements.map((entry) => entry.id)).size,
    profile.engagements.length
  )

  const markdownResponse = await get('/profile.md')
  assert.equal(markdownResponse.status, 200)
  assert.match(markdownResponse.headers.get('content-type'), /text\/markdown/)
  const markdown = await markdownResponse.text()
  const work = await (await get('/work')).text()
  for (const entry of profile.engagements) {
    assert.equal(entry.employer, profile.employer)
    assert.notEqual(entry.client, entry.employer)
    assert.ok(work.includes(`id="${entry.id}"`), `Missing section ${entry.id}`)
    assert.ok(markdown.includes(entry.sourceUrl))
    assert.equal(new URL(entry.sourceUrl).hash, `#${entry.id}`)
    assert.ok(markdown.includes(entry.summary))
  }

  const llms = await get('/llms.txt')
  assert.equal(llms.status, 200)
  assert.match(llms.headers.get('content-type'), /text\/plain/)
  const index = await llms.text()
  assert.ok(index.includes('/profile.json'))
  assert.ok(index.includes('/profile.md'))
})

test('discovery includes published writing; drafts and unknown pages return 404', async () => {
  const profile = await (await get('/profile.json')).json()
  const sitemap = await (await get('/sitemap.xml')).text()
  const robots = await (await get('/robots.txt')).text()
  assert.match(robots, /Allow: \//)
  assert.doesNotMatch(robots, /Disallow: \/blog/)
  assert.match(robots, /Sitemap: https:\/\/devonbull.com\/sitemap.xml/)
  for (const post of profile.writing) {
    assert.ok(sitemap.includes(post.url))
    assert.equal((await get(new URL(post.url).pathname)).status, 200)
  }

  const postFiles = (
    await readdir(new URL('../posts/', import.meta.url))
  ).filter((file) => file.endsWith('.mdx'))
  for (const file of postFiles) {
    const text = await readFile(
      new URL(`../posts/${file}`, import.meta.url),
      'utf8'
    )
    if (!/^draft:\s*true\s*$/m.test(text)) continue
    const path = `/blog/${file.replace(/\.mdx$/, '')}`
    assert.equal((await get(path)).status, 404, `Draft exposed at ${path}`)
    assert.ok(!sitemap.includes(path))
    assert.ok(
      !profile.writing.some((post) => new URL(post.url).pathname === path)
    )
  }
  assert.equal((await get('/blog/this-post-does-not-exist')).status, 404)
  assert.equal((await get('/tags/this-tag-does-not-exist')).status, 404)
})

test('HTML contains an accurate employer relationship and profile discovery without JavaScript', async () => {
  const response = await get('/')
  assert.equal(response.status, 200)
  const html = await response.text()
  const match = html.match(
    /<script type="application\/ld\+json">(.*?)<\/script>/s
  )
  assert.ok(match, 'Missing JSON-LD')
  const structured = JSON.parse(match[1])
  assert.equal(structured.mainEntity.name, 'Devon Bull')
  assert.equal(structured.mainEntity.worksFor.name, 'Big Nerd Ranch')
  assert.ok(html.includes('href="/profile.json"'))
  assert.ok(html.includes('href="/profile.md"'))
  assert.ok(html.includes('id="main-content"'))
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1)
})
