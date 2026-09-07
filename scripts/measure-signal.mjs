import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { writeFile } from 'node:fs/promises'

const [
  base = 'http://localhost:3000',
  output = '/tmp/signal-performance.json',
  tooling = '/tmp/signal-tooling'
] = process.argv.slice(2)
const require = createRequire(resolve(tooling, 'package.json'))
const { chromium } = require('playwright')
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const runs = []
try {
  for (let run = 0; run < 3; run++) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
      colorScheme: 'dark'
    })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: 200000,
      uploadThroughput: 93750
    })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await cdp.send('Performance.enable')
    await page.addInitScript(() => {
      window.signalMeasurements = { lcp: 0, cls: 0 }
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          window.signalMeasurements.lcp = entry.startTime
      }).observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (!entry.hadRecentInput)
            window.signalMeasurements.cls += entry.value
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.goto(base, { waitUntil: 'networkidle' })
    const before = await cdp.send('Performance.getMetrics')
    await page.waitForTimeout(2000)
    const after = await cdp.send('Performance.getMetrics')
    const metric = (data, name) =>
      data.metrics.find((item) => item.name === name)?.value || 0
    const values = await page.evaluate(() => ({
      ...window.signalMeasurements,
      resources: performance.getEntriesByType('resource').length,
      transferBytes: performance
        .getEntriesByType('resource')
        .reduce((sum, entry) => sum + entry.transferSize, 0)
    }))
    runs.push({
      run: run + 1,
      ...values,
      idleScriptMs:
        1000 *
        (metric(after, 'ScriptDuration') - metric(before, 'ScriptDuration'))
    })
    await context.close()
  }
} finally {
  await browser.close()
}
const median = (name) => runs.map((run) => run[name]).sort((a, b) => a - b)[1]
const result = {
  base,
  conditions: {
    chrome: 'installed stable',
    width: 390,
    height: 844,
    cpuSlowdown: 4,
    latencyMs: 150,
    downloadBytesPerSecond: 200000,
    reducedMotion: true,
    samples: 3
  },
  runs,
  median: {
    lcp: median('lcp'),
    cls: median('cls'),
    transferBytes: median('transferBytes'),
    idleScriptMs: median('idleScriptMs')
  },
  limitations:
    'Local lab only. CLS sample is limited to initial load. Does not measure field INP or real-user percentiles.'
}
await writeFile(output, JSON.stringify(result, null, 2))
console.log(JSON.stringify(result, null, 2))
