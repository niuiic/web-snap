import { chromium } from 'playwright'

const browser = await chromium.connectOverCDP('http://127.0.0.1:9222')

const page = await browser.newPage()
await page.goto('https://www.baidu.com')
