import { join } from '@std/path'
import { PdfMerger } from './pdfMerger.ts'
import { BasePageFactory } from './page/page.factory.ts'
import { from, mergeMap, toArray, firstValueFrom, retry } from 'rxjs'

export class App {
  constructor(
    private readonly pageFactory: BasePageFactory,
    private readonly outputDir: string,
    private readonly getPagesInfo: () => Promise<PageInfo[]>
  ) {}

  async exec() {
    const pagesInfo = await this.getPagesInfo()

    const outputFiles = await firstValueFrom(
      from(pagesInfo).pipe(
        mergeMap(async (pageInfo) => {
          const page = await this.pageFactory.create(pageInfo.url)
          await page.prepare()
          await page.validate()
          const outputFile = join(this.outputDir, `${pageInfo.name}.pdf`)
          await page.shot(outputFile)
          page.close()
          return outputFile
        }, 3),
        retry(3),
        toArray()
      )
    )

    await new PdfMerger().merge(outputFiles, join(this.outputDir, 'result.pdf'))
  }
}

export interface PageInfo {
  name: string
  url: string
}
