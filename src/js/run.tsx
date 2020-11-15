import 'chrome-extension-async'
import { getHosts, getHostKey, findMatchedHosts } from 'libs'

const baseURL = chrome.runtime.getURL('base.js')

const isValidURL = (url) => {
  return (
    url &&
    (url.startsWith('//') ||
      url.startsWith('https://') ||
      url.startsWith('http://'))
  )
}

const catchErr = (e) => {
  console.error('Failed to inject scripts:', e)
}

const injectScriptPromise = (src, where = 'head') => {
  return new Promise((resolve, reject) => {
    const elm = document.createElement('script')
    const targetElement = document[where] ? document[where] : document.head
    targetElement.appendChild(elm)
    elm.onload = () => {
      resolve(`Inject ${src} complete!`)
    }
    elm.src = src
  })
}

const extractScripts = (customjs, injections) => {
  if (!customjs) {
    return
  }
  const {
    config: { enable, include, extra },
    source
  } = customjs
  if (!enable) {
    return
  }

  // base.js to provide useful functions
  injections.add(baseURL)

  // Predefined include
  if (include) {
    injections.add('https://ajax.googleapis.com/ajax/libs' + include)
  }

  // Extra include
  ;(extra || '')
    .split(';')
    .map((x) => x.trim())
    .forEach((line) => {
      if (isValidURL(line)) {
        injections.add(line)
      }
    })

  return source
}

const loadScripts = async (location) => {
  const hosts = await getHosts()
  const matchedHosts = findMatchedHosts(hosts, location)
  const injections = new Set()
  Promise.all(
    matchedHosts.map(async (host) => {
      const hostKey = getHostKey(host)
      const obj = await chrome.storage.sync.get(hostKey)
      return extractScripts(obj[hostKey], injections)
    })
  )
    .then((values) => values.filter((x) => x))
    .then((values) => {
      if (values.length) {
        console.info(
          'Custom JavaScript for websites enabled.\nPlease visit https://xcv58.xyz/inject-js if you have any issue.'
        )
      }
      return Promise.all(
        [...injections].map((src) => src && injectScriptPromise(src))
      )
        .then(() => values)
        .catch(catchErr)
    })
    .then((values) => values.map((src) => injectScriptPromise(src, 'body')))
    .catch(catchErr)
}

loadScripts(window.location)
