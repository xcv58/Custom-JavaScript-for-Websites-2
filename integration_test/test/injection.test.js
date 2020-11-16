import { ALL, EACH } from '../util'

describe('The Extension page should', () => {
  beforeAll(ALL)
  afterAll(ALL)
  beforeEach(EACH)
  afterEach(EACH)

  it('execute the injected script after page loaded', async () => {
    await page.evaluate(() => {
      const editor = window.ace.edit('ace-editor')
      editor.session.setValue(`
console.log('abc')
document.querySelector('body').style.background = 'red'`)
    })
    await page.waitForTimeout(1000)
    await page.$eval('button', (x) => x.click())

    const newPage = await browser.newPage()
    await newPage.goto('https://google.com')
    await newPage.bringToFront()
    const background = await newPage.$eval(
      'body',
      (node) => node.style.background
    )
    expect(background).toBe('red')

    page.bringToFront()
    const buttons = await page.$$('button')
    await buttons[1].click()
    await page.waitForTimeout(100)
    const dialogButtons = await page.$$('.MuiDialogActions-root > button')
    expect(dialogButtons).toHaveLength(3)
    await dialogButtons[1].click()
  })
})
