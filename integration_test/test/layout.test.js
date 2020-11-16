import { ALL, EACH } from '../util'

describe('The Extension page should', () => {
  beforeAll(ALL)
  beforeEach(EACH)

  it('have title ends with the extension name', async () => {
    await expect(page.title()).resolves.toMatch('Custom JavaScript')
  })

  it('render correct layout', async () => {
    const buttons = await page.$$('button')
    expect(buttons).toHaveLength(7)
    const checkbox = await page.$$('input[type="checkbox"]')
    expect(checkbox).toHaveLength(1)
    expect(await page.$$('a[href="https://paypal.me/xcv58"]')).toHaveLength(1)
    const aceEditor = await page.$('#ace-editor')
    expect(aceEditor).toBeTruthy()
    expect(await page.$eval('#ace-editor', (node) => node.textContent)).toMatch(
      '// Here You can type your custom JavaScript...'
    )
  })
})
