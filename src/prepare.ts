import { Page } from 'playwright'

export const hideElements = (page: Page, selectors: string[]) =>
  page.addStyleTag({
    content: selectors.join(',') + '{display: none !important;}'
  })
