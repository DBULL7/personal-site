import { writeFile } from 'node:fs/promises'

const contours = Array.from({ length: 48 }, (_, index) => {
  const radius = 80 + index * 4.8
  const points = Array.from({ length: 181 }, (_, step) => {
    const angle = (step / 180) * Math.PI * 2
    const swell = Math.sin(angle * 3 + index * 0.025) * (10 + index * 0.13)
    const x = 350 + (radius + swell) * Math.cos(angle)
    const y = 350 + (radius + swell) * Math.sin(angle) * 0.94
    return `${step === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  })
  return `<path d="${points.join(' ')} Z" stroke-opacity="${0.28 + (index / 47) * 0.44}"/>`
}).join('')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700" fill="none" color="#a9c1ae"><circle cx="350" cy="350" r="335" stroke="currentColor" stroke-opacity="0.25" stroke-width="0.7"/><circle cx="350" cy="350" r="328" stroke="currentColor" stroke-opacity="0.14" stroke-width="0.7"/><g stroke="currentColor" stroke-width="0.75">${contours}</g><circle cx="350" cy="350" r="47" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.75"/><circle cx="350" cy="350" r="3" fill="currentColor"/><path d="M15 350H43 M657 350H685 M350 15V43 M350 657V685" stroke="currentColor" stroke-opacity="0.55" stroke-width="0.75"/></svg>`
await writeFile(
  new URL('../public/resonance-engraving.svg', import.meta.url),
  svg
)
