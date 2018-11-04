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
  setData: async (message, _, sendResponse) => {
    const { matchedHost, customjs } = message
    const hostKey = getHostKey(matchedHost)
    try {
      await chrome.storage.sync.set({ [hostKey]: customjs })
      sendResponse()
    } catch (err) {
      sendResponse(err)
    }
  },
  removeData: (message, { url }) => {
    const { isRegex, pattern } = message
    if (isRegex) {
      chrome.storage.sync.remove(pattern)
    } else {
      chrome.storage.sync.remove(url.origin)
    }
  },
  goTo: (message, { tab }) => chrome.tabs.update(tab.id, { url: message.link })
}

const onMessage = async (message, sender, sendResponse) => {
  const { domain } = message
  try {
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
  } catch (e) {
    sendResponse({ error: e.message })
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

chrome.runtime.onInstalled.addListener((details) => {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    if (tabs.length <= 0) {
      return
    }
    const { windowId } = tabs[0]
    setLastFocusedWindowId(windowId)
  })
})
