export const setLastFocusedWindowId = (lastFocusedWindowId) => {
  chrome.storage.local.set({ lastFocusedWindowId })
}

export const getLastFocusedWindowId = async () => {
  const { lastFocusedWindowId } = await chrome.storage.local.get({ lastFocusedWindowId: null })
  return lastFocusedWindowId
}

const getQueryInfo = (windowId) => {
  if (windowId) {
    return { windowId }
  }
  return { currentWindow: true }
}

export const getActiveTab = async () => {
  const windowId = await getLastFocusedWindowId()
  const queryInfo = getQueryInfo(windowId)
  const tabs = await chrome.tabs.query({ ...queryInfo, active: true })
  if (tabs.length <= 0) {
    // TODO: handle this in UI
    throw new Error('No active tab! This is impossible')
  }
  return tabs[0]
}

const SOURCE_PREFIX = 'data:text/javascript'
const BASE64_PREFIX = SOURCE_PREFIX + ';base64,'
const UTF8_PREFIX = SOURCE_PREFIX + ';charset=utf-8,'

export const encodeSource = (script) => {
  // base64 may be smaller, but does not handle unicode characters
  // attempt base64 first, fall back to escaped text
  try {
    return (BASE64_PREFIX + window.btoa(script))
  } catch (e) {
    return (UTF8_PREFIX + encodeURIComponent(script))
  }
}

export const decodeSource = (source) => {
  if (source.startsWith(BASE64_PREFIX)) {
    return window.atob(source.replace(BASE64_PREFIX, ''))
  }
  if (source.startsWith(UTF8_PREFIX)) {
    return decodeURIComponent(source.replace(UTF8_PREFIX, ''))
  }
  if (!source) {
    return ''
  }
  return source
}

export const getHosts = async (key) => {
  const result = await chrome.storage.sync.get({ hosts: [] })
  if (Array.isArray(result.hosts) && result.hosts.length > 0) {
    return result.hosts
  }
  const { hosts = [] } = JSON.parse(window.localStorage.getItem(key) || '{}')
  return hosts
}

export const setHosts = async (hosts = []) => {
  chrome.storage.sync.set({ hosts })
}

export const clearHosts = () => {
  chrome.storage.sync.remove('hosts')
}
