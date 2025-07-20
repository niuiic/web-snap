import { chromium } from 'playwright-extra'
import stealth from 'puppeteer-extra-plugin-stealth'

chromium.use(stealth())

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222')
const page = await browser.newPage({
  viewport: {
    width: 800,
    height: 1000
  }
})

// const articles =
// body > div.book-container > div.off-canvas-content > div.columns > div > div.book-content > div.book-post > div:nth-child(4) > ul > li > a
await page.goto(
  'https://learn.lianglianglee.com/%E4%B8%93%E6%A0%8F/Kafka%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98',
  { waitUntil: 'load' }
)
const hideElements = [
  'body > div.book-container > div.off-canvas-content > div.columns > div > div.book-content > div.book-post > div:nth-child(1)',
  'body > div.book-container > div.off-canvas-content > div.columns > div > div.book-content > div:nth-child(2)',
  'body > div.book-container > div.book-sidebar',
  'body > div.book-container > div.off-canvas-content > div.copyright',
  'body > div.book-container > div.sidebar-toggle'
]
await page.addStyleTag({
  content: hideElements
    .map((x) => `${x} { display: none !important; }`)
    .join('')
})
await page.addStyleTag({
  content: '.off-canvas-content { margin: unset !important; }'
})
await page.waitForTimeout(1e3)
await page.pdf({ path: './output/learn.pdf' })
await page.close()
await browser.close()
