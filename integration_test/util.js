export const manifest = require('../src/manifest.json')

export const getExtensionURL = async (browser) => {
  const extensionId = await getExtensionId(browser)
  return `chrome-extension://${extensionId}/popup.html#/?domain=https%3A%2F%2Fwww.google.com`
}

const getExtensionId = async (browser) => {
  const targets = await browser.targets()
  const extensionTarget = targets.find(({ _targetInfo }) => {
    return (
      _targetInfo.title === manifest.name &&
      _targetInfo.type === 'background_page'
    )
  })
  const extensionUrl = extensionTarget._targetInfo.url || ''
  const [, , extensionId] = extensionUrl.split('/')
  return extensionId
}

export const ALL = async () => {
  const extensionURL = await getExtensionURL(browser)
  await page.goto(extensionURL)
  await page.waitForTimeout(2000)
}

export const EACH = async () => {
  await page.bringToFront()
  await page.waitForTimeout(500)
}
