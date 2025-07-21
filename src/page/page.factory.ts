import { Browser } from 'playwright'
import { getBrowser } from '../browser.ts'
import { IPage } from './page.entity.ts'

export abstract class BasePageFactory {
  private browser: Promise<Browser>

  constructor(cdpURL: string) {
    this.browser = getBrowser(cdpURL)
  }

  abstract create(url: string): Promise<IPage>
}
