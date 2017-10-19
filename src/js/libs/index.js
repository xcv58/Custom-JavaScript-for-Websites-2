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
