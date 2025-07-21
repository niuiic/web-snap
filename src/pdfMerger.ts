import { PDFDocument } from 'pdf-lib'

export class PdfMerger {
  async merge(filePaths: string[], outputPath: string) {
    const mergedPdf = await PDFDocument.create()

    for (const path of filePaths) {
      const pdfBytes = await Deno.readFile(path)
      const pdfDoc = await PDFDocument.load(pdfBytes)
      const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
      pages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedPdfBytes = await mergedPdf.save()
    await Deno.writeFile(outputPath, mergedPdfBytes)
  }
}
