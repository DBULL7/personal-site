import { readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const { person } = JSON.parse(
  await readFile(new URL('../content/signal.json', import.meta.url), 'utf8')
)
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
const rings = Array.from(
  { length: 18 },
  (_, i) =>
    `<ellipse cx="1010" cy="330" rx="${130 + i * 12}" ry="${80 + i * 10}" fill="none" stroke="#90c6a0" opacity="${0.12 + i * 0.015}"/>`
).join('')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#10251e"/>${rings}<path d="M70 90H1130M70 530H1130" stroke="#496357"/><text x="70" y="175" fill="#c5f0bc" font-size="20" font-family="monospace">SELECTED WORK</text><text x="65" y="305" fill="#f2f4e9" font-size="104" font-family="Georgia,serif">${escape(person.name)}</text><text x="70" y="370" fill="#f2f4e9" font-size="30" font-family="Arial,sans-serif">${escape(person.title)}</text><text x="70" y="418" fill="#bbccc0" font-size="24" font-family="Arial,sans-serif">${escape(person.employer)}</text><text x="70" y="575" fill="#bbccc0" font-size="19" font-family="monospace">${escape(person.site.replace('https://', ''))}</text></svg>`
await writeFile(new URL('../public/signal-social.svg', import.meta.url), svg)
await sharp(Buffer.from(svg))
  .png()
  .toFile(new URL('../public/signal-social.png', import.meta.url).pathname)
