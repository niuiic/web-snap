import { App, PageInfo } from '../app.ts'
import { getBrowser } from '../browser.ts'
import { join } from '@std/path'
import { BasePageFactory } from '../page/page.factory.ts'
import { Page } from 'playwright'
import { IPage } from '../page/page.entity.ts'
import { hideElements } from '../prepare.ts'
import { assert } from '@std/assert'

// % browser %
const browser = await getBrowser()

// % PageFactory %
class PageFactory extends BasePageFactory {
  override toPage(page: Page): IPage {
    return {
      prepare: async () => {
        await page.waitForLoadState('networkidle')
        await hideElements(page, [
          'body > div.book-container > div.book-sidebar',
          'body > div.book-container > div.off-canvas-content > div.columns > div > div.book-content > div:nth-child(2)',
          'body > div.book-container > div.off-canvas-content > div.copyright',
          'body > div.book-container > div.sidebar-toggle',
          'body > div.book-container > div.off-canvas-content > div.columns > div > div.book-content > div.book-post > div:nth-child(1)'
        ])
        await page.addStyleTag({
          content:
            'body > div.book-container > div { margin-left: unset !important; }'
        })
        await page.waitForTimeout(5e2)
      },
      validate: async () => assert(await page.locator('#title').isEnabled()),
      shot: (outputPath: string) => page.pdf({ path: outputPath }),
      close: async () => {
        await page.waitForTimeout(5e2)
        await page.close()
      }
    }
  }
}

// % getPageUrls %
const getPageUrls = async (): Promise<PageInfo[]> => {
  const page = await browser.newPage()
  await page.goto(
    'https://learn.lianglianglee.com/%E4%B8%93%E6%A0%8F/Kafka%E6%A0%B8%E5%BF%83%E6%8A%80%E6%9C%AF%E4%B8%8E%E5%AE%9E%E6%88%98'
  )
  const articles = await page
    .locator(
      'body > div.book-container > div.off-canvas-content > div.columns > div > div.book-content > div.book-post > div:nth-child(4) > ul > li > a'
    )
    .all()

  return Promise.all(
    articles.map(async (article) => ({
      name: await article.innerText(),
      url: await article.getAttribute('href')
    }))
  )
    .then((pagesInfo) =>
      pagesInfo
        .filter((pageInfo): pageInfo is PageInfo =>
          Boolean(pageInfo.name && pageInfo.url)
        )
        .map((pageInfo) => ({
          name: pageInfo.name,
          url: new URL(pageInfo.url, 'https://learn.lianglianglee.com/').href
        }))
    )
    .finally(() => page.close())
}

// % app %
const app = new App(
  new PageFactory(browser),
  join(Deno.cwd(), 'output', 'lianglianglee'),
  getPageUrls
)
await app.exec()

await browser.close()
