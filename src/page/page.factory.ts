import { Browser, Page } from 'playwright'
import { IPage } from './page.entity.ts'

export abstract class BasePageFactory {
  constructor(private readonly browser: Browser) {}

  async create(url: string): Promise<IPage> {
    const page = await this.browser.newPage()
    page.goto(url)
    return this.toPage(page)
  }

  abstract toPage(page: Page): IPage
}
