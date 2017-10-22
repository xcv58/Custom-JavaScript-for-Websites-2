const injectScript = (src, where) => {
  const elm = document.createElement('script')
  elm.src = src
  document[where || 'head'].appendChild(elm)
}

const website = window.location.protocol + '//' + window.location.host

chrome.storage.sync.get(website, (obj) => {
  const customjs = obj[website]
  if (!customjs) {
    return
  }
  const { config: { enable, include, extra }, source } = customjs
  if (!enable) {
    return
  }

  // base.js to provide useful functions
  injectScript(chrome.runtime.getURL('base.js'))

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
})
