import { chromium } from 'playwright'

export const getBrowser = (cdpURL: string = 'http://127.0.0.1:9222') =>
  chromium.connectOverCDP(cdpURL)
