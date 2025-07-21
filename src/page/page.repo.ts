import { IPage } from './page.entity.ts'

export abstract class BasePageRepo {
  private pages = new Map<string, IPage>()

  constructor(private pageFactory: { create(url: string): Promise<IPage> }) {}

  async addPage(url: string): Promise<IPage> {
    const page = await this.pageFactory.create(url)
    this.pages.set(url, page)
    return page
  }

  removePage(page: IPage) {
    page.close()
    this.pages.delete(page.getUrl())
  }

  findPageByUrl(url: string) {
    return this.pages.get(url)
  }

  abstract getPageUrls(): Promise<string[]>
}
