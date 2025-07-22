import { PDFDocument } from 'pdf-lib'
import { basename, dirname, extname, join } from '@std/path'
import { assert } from '@std/assert'

export class PdfMerger {
  constructor() {
    assert(
      new Deno.Command('cpdf', { args: ['-help'] }).outputSync().success,
      'cpdf is required'
    )
  }

  async merge(filePaths: string[], outputPath: string) {
    const mergedPdf = await PDFDocument.create()

    const bookmarks = []

    let pathIndex = 0
    let pageCount = 0
    for (const path of filePaths) {
      const pdfBytes = await Deno.readFile(path)
      const pdfDoc = await PDFDocument.load(pdfBytes)
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
      pages.forEach((page) => mergedPdf.addPage(page))

      const fileName = basename(path).slice(0, -extname(path).length)
      bookmarks.push(
        `0 "${fileName.replaceAll('"', '').replaceAll('?', '')}" ${pageCount + 1} `
      )
      pathIndex += 1
      pageCount += pdfDoc.getPageCount()
    }

    const mergedPdfBytes = await mergedPdf.save()
    const tempOutputPath = outputPath + '_temp'
    await Deno.writeFile(tempOutputPath, mergedPdfBytes)

    const bookmarkFile = join(dirname(outputPath), 'bookmarks.txt')
    await Deno.writeTextFile(bookmarkFile, bookmarks.join('\n'))

    await new Deno.Command('cpdf', {
      args: ['-add-bookmarks', bookmarkFile, tempOutputPath, '-o', outputPath]
    }).output()

    await Deno.remove(tempOutputPath)
    await Deno.remove(bookmarkFile)
  }
}

const pdfs = Array.from(
  Deno.readDirSync('./output/lianglianglee/').map((x) =>
    join(Deno.cwd(), 'output/lianglianglee', x.name)
  )
)
new PdfMerger().merge(pdfs, join(Deno.cwd(), 'output/merged.pdf'))
