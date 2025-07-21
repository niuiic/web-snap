import { chromium } from 'playwright'

// import { chromium } from 'playwright-extra'
// import stealth from 'puppeteer-extra-plugin-stealth'
//
// chromium.use(stealth())

export const getBrowser = (cdpURL: string = 'http://127.0.0.1:9222') =>
  chromium.connectOverCDP(cdpURL)
