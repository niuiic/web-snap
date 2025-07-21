export interface IPage {
  getUrl(): string
  prepare(): Promise<void>
  shot(): Promise<void>
  close(): void
}
