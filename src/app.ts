import { join } from '@std/path'
import { PdfMerger } from './pdfMerger.ts'
import { BasePageFactory } from './page/page.factory.ts'
import { from, of, mergeMap, toArray, firstValueFrom, retry } from 'rxjs'

export class App {
  constructor(
    private readonly pageFactory: BasePageFactory,
    private readonly outputDir: string,
    private readonly getPagesInfo: () => Promise<PageInfo[]>,
    private readonly concurrency: number = 3
  ) {}

  async exec() {
    const pagesInfo = await this.getPagesInfo()

    const outputFiles = await firstValueFrom(
      from(pagesInfo).pipe(
        mergeMap((pageInfo) => from(this.shotPage(pageInfo)), this.concurrency),
        toArray()
      )
    )

    await new PdfMerger().merge(outputFiles, join(this.outputDir, 'result.pdf'))
  }

  private async shotPage(pageInfo: PageInfo): Promise<string> {
    let closePage: () => void
    const fn = async () => {
      const page = await this.pageFactory.create(pageInfo.url)
      closePage = page.close.bind(page)
      await page.prepare()
      console.log(pageInfo)
      await page.validate()
      const outputFile = join(this.outputDir, `${pageInfo.name}.pdf`)
      await page.shot(outputFile)
      return outputFile
    }

    return firstValueFrom(
      of(fn).pipe(
        mergeMap((fn) => from(fn().finally(() => closePage()))),
        retry(3)
      )
    )
  }
}

export interface PageInfo {
  name: string
  url: string
}
