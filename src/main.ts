import { chromium } from 'playwright'

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222')

const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 2
})
await page.goto('https://www.baidu.com', { waitUntil: 'networkidle' })
await page.screenshot({
  fullPage: true,
  path: './output/test.png',
  scale: 'device'
})

await browser.close()
