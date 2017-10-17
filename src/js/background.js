const getURL = ({ url }) => new window.URL(url)

const reloadTab = (tab) => chrome.tabs.reload(tab.id)

const methodMap = {
  getData: (message, { url }, sendResponse) => {
    const { host, protocol, origin } = url
    chrome.storage.sync.get(origin, (data) => {
      const customjs = data[origin]
      sendResponse({ customjs, host, protocol })
    })
  },
  setData: (message, { url }) => chrome.storage.sync.set(
    { [url.origin]: message.customjs }
  ),
  removeData: (message, { url }) => chrome.storage.sync.remove(url.origin),
  goTo: (message, { tab }) => chrome.tabs.update(tab.id, { url: message.link })
}

const onMessage = (message, sender, sendResponse) => chrome.tabs.query(
  { active: true, currentWindow: true },
  (tabs) => {
    if (tabs.length <= 0) {
      // TODO: handle this in UI
      throw new Error('No active tab! This is impossible')
    }
    const [ tab ] = tabs
    const url = getURL(tab)
    const { method, reload } = message

    const func = methodMap[method]
    if (func && typeof func === 'function') {
      func(message, { tab, url }, sendResponse)
    } else {
      console.error(`Unknown method: ${method}`)
      sendResponse({ src: '', config: {} })
    }

    if (reload) {
      reloadTab(tab)
    }
  }
)

chrome.runtime.onMessage.addListener((...args) => {
  onMessage(...args)
  return true
})
