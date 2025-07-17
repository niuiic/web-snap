import { chromium } from 'playwright'

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222')
const page = await browser.newPage()
await page.goto(
  'https://learn.lianglianglee.com/%E4%B8%93%E6%A0%8F/10x%E7%A8%8B%E5%BA%8F%E5%91%98%E5%B7%A5%E4%BD%9C%E6%B3%95'
)
await page.pdf({ path: './output/learn.pdf' })
await page.close()
