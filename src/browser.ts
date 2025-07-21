import { chromium } from 'playwright-extra'
import stealth from 'puppeteer-extra-plugin-stealth'

chromium.use(stealth())

export const getBrowser = (cdpURL: string) => chromium.connectOverCDP(cdpURL)
