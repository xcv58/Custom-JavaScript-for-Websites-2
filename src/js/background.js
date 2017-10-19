import 'chrome-extension-async'
import { getActiveTab, setLastFocusedWindowId } from 'libs'

const getURL = ({ url }) => new window.URL(url)

const reloadTab = (tab) => chrome.tabs.reload(tab.id)

const methodMap = {
  getData: async (message, { url }, sendResponse) => {
    const { host, protocol, origin } = url
    const data = await chrome.store.sync.get(origin)
    const customjs = data[origin]
    sendResponse({ customjs, host, protocol })
  },
  setData: (message, { url }) => chrome.storage.sync.set(
    { [url.origin]: message.customjs }
  ),
  removeData: (message, { url }) => chrome.storage.sync.remove(url.origin),
  goTo: (message, { tab }) => chrome.tabs.update(tab.id, { url: message.link })
}

const onMessage = async (message, sender, sendResponse) => {
  const tab = await getActiveTab()
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

const onFocusChanged = (windowId) => {
  if (windowId < 0) {
    return
  }
  setLastFocusedWindowId(windowId)
}

chrome.runtime.onMessage.addListener((...args) => {
  onMessage(...args)
  return true
})

chrome.windows.onFocusChanged.addListener(onFocusChanged)
