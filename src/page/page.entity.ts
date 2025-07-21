export interface IPage {
  prepare(): Promise<void>
  validate(): Promise<void>
  shot(outputPath: string): Promise<void>
  close(): void
}
