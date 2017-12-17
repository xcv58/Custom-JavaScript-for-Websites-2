import 'chrome-extension-async'
import { findMatchedHosts, getHostKey, getActiveTab, getHosts, setLastFocusedWindowId } from 'libs'

const getURL = ({ url }) => new window.URL(url)

const reloadTab = (tab) => chrome.tabs.reload(tab.id)

const methodMap = {
  getData: async (message, { tab, url }, sendResponse) => {
    const { host, protocol } = url
    const hosts = await getHosts()
    const matchedHosts = findMatchedHosts(hosts, url, message)
    if (matchedHosts.length === 0) {
      sendResponse({ host, protocol, tab })
    } else {
      const matchedHost = matchedHosts[0]
      const hostKey = getHostKey(matchedHost)
      const data = await chrome.storage.sync.get(hostKey)
      const customjs = data[hostKey]
      sendResponse({ customjs, host, protocol, tab, matchedHost })
    }
  },
  setData: (message, { url }) => chrome.storage.sync.set(
    { [url.origin]: message.customjs }
  ),
  removeData: (message, { url }) => chrome.storage.sync.remove(url.origin),
  goTo: (message, { tab }) => chrome.tabs.update(tab.id, { url: message.link })
}

const onMessage = async (message, sender, sendResponse) => {
  const { domain } = message
  const tab = await getActiveTab()
  const url = domain ? getURL({ url: domain }) : getURL(tab)
  const { method, reload } = message

  const func = methodMap[method]
  if (func && typeof func === 'function') {
    func(message, { tab, url }, sendResponse)
  } else {
    console.error(`Unknown method: ${method}`)
    sendResponse({ source: '', config: {} })
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
