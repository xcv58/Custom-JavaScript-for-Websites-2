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
    await page.evaluate(() => {
      document.querySelectorAll('button')[6].click()
    })
    await page.waitForTimeout(100)
    const input = await page.$$('textarea')
    await input[1].evaluate((node) => (node.value = ''))
    await input[1].type(
      'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.11.0/underscore-min.js',
      { delay: 5 }
    )
    await page.waitForTimeout(100)
    const allButtons = await page.$$('button')
    await allButtons[allButtons.length - 1].click()
    await page.waitForTimeout(100)
    await page.$eval('button', (x) => x.click())

    const newPage = await browser.newPage()
    await newPage.goto('https://google.com')
    await newPage.bringToFront()
    const background = await newPage.$eval(
      'body',
      (node) => node.style.background
    )
    expect(background).toBe('red')
    expect(await newPage.$eval('body', (node) => window._.VERSION)).toBe(
      '1.11.0'
    )

    page.bringToFront()
    const buttons = await page.$$('button')
    await buttons[1].click()
    await page.waitForTimeout(100)
    const dialogButtons = await page.$$('.MuiDialogActions-root > button')
    expect(dialogButtons).toHaveLength(3)
    await dialogButtons[1].click()
    await page.waitForTimeout(500)
  })
})
