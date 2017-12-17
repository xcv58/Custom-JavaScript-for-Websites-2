import 'chrome-extension-async'
import { getHosts, getHostKey, findMatchedHosts } from 'libs'

const injectedSet = new Set()

const baseURL = chrome.runtime.getURL('base.js')

const injectScript = (src, where) => {
  if (injectedSet.has(src)) {
    return
  }
  injectedSet.add(src)
  if (!injectedSet.has(baseURL)) {
    injectScript(baseURL)
  }
  const elm = document.createElement('script')
  elm.src = src
  document[where || 'head'].appendChild(elm)
}

const executeScript = (customjs) => {
  if (!customjs) {
    return
  }
  const { config: { enable, include, extra }, source } = customjs
  if (!enable) {
    return
  }

  // base.js to provide useful functions

  // Predefined include
  if (include) {
    injectScript('https://ajax.googleapis.com/ajax/libs' + include)
  }

  // Extra include
  (extra || '').split(';').map(x => x.trim()).forEach((line) => {
    if (line && line.substr(0, 1) !== '#') {
      injectScript(line)
    }
  })

  // User defined Script
  if (source) {
    setTimeout(function () {
      injectScript(source, 'body')
    }, 250)
  }
}

const loadScripts = async (location) => {
  const hosts = await getHosts()
  const matchedHosts = findMatchedHosts(hosts, location)
  matchedHosts.forEach((host) => {
    const hostKey = getHostKey(host)
    chrome.storage.sync.get(hostKey, (obj) => executeScript(obj[hostKey]))
  })
}

loadScripts(window.location)
