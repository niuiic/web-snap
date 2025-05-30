import { chromium } from 'playwright'

const wsUrl =
  'ws://127.0.0.1:9222/devtools/page/927D024659F56E58CF8C41391E462EA5'
const browser = await chromium.connectOverCDP(wsUrl)
console.log(browser)
