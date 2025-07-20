import { chromium } from 'playwright-extra'
import stealth from 'puppeteer-extra-plugin-stealth'

chromium.use(stealth())

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222')
const page = await browser.newPage()

await page.goto(
  'https://learn.lianglianglee.com/%E4%B8%93%E6%A0%8F/Kafka%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98/00%20%E5%BC%80%E7%AF%87%E8%AF%8D%20%E4%B8%BA%E4%BB%80%E4%B9%88%E8%A6%81%E5%AD%A6%E4%B9%A0Kafka%EF%BC%9F.md'
)
await page.waitForTimeout(1e3)
await page.pdf({ path: './output/learn.pdf' })
await page.close()
await browser.close()
