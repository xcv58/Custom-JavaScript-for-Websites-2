import { Page, ChromiumBrowserContext } from 'playwright'
import { toMatchImageSnapshot, } from 'jest-image-snapshot'
import { CLOSE_PAGES, initBrowserWithExtension, } from '../util'

expect.extend({ toMatchImageSnapshot })

let page: Page
let browserContext: ChromiumBrowserContext
let extensionURL: string

describe('The Extension page should', () => {
  beforeAll(async () => {
    const init = await initBrowserWithExtension()
    browserContext = init.browserContext
    extensionURL = init.extensionURL
    page = browserContext.pages()[0]
  })

  afterAll(async () => {
    await browserContext?.close()
    browserContext = null
    page = null
    extensionURL = ''
  })

  beforeEach(async () => {
    if (!extensionURL) {
      console.error('Invalid extensionURL', { extensionURL })
    }
    await page.bringToFront()
    await page.goto(extensionURL)
    await page.waitForTimeout(1000)
    await CLOSE_PAGES(browserContext)
  })

  afterEach(async () => {
    await CLOSE_PAGES(browserContext)
  })

  it('have title ends with the extension name', async () => {
    await page.goto(extensionURL)
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

  it('execute the injected script after page loaded', async () => {
    await page.goto(extensionURL)
    await page.waitForTimeout(1000)
    await page.evaluate(() => {
      const editor = window.ace.edit('ace-editor')
      editor.session.setValue(`
console.log('abc')
document.querySelector('body').style.background = 'red'`)
    })
    await page.evaluate(() => {
      document.querySelectorAll('button')[6].click()
    })
    await page.waitForTimeout(500)
    const input = await page.$$('textarea')
    await input[1].evaluate((node) => (node.value = ''))
    await input[1].type(
      'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.11.0/underscore-min.js',
      { delay: 2 }
    )
    await page.waitForTimeout(500)
    const allButtons = await page.$$('button')
    await allButtons[allButtons.length - 1].click()
    await page.waitForTimeout(500)
    await page.$eval('button', (x) => x.click())

    const newPage = await browserContext.newPage()
    await newPage.goto('https://google.com/')
    await newPage.bringToFront()
    await page.waitForTimeout(500)
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
    await page.waitForTimeout(500)
    const dialogButtons = await page.$$('.MuiDialogActions-root > button')
    expect(dialogButtons).toHaveLength(3)
    await dialogButtons[1].click()
  })
})
