chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
  const website = window.location.protocol + '//' + window.location.host
  switch (request.method) {
    case 'setData':
      const syncdata = {
        [website]: request.customjs
      }
      chrome.storage.sync.set(syncdata)
      break
    case 'getData':
      chrome.storage.sync.get(website, function (obj) {
        const customjs = obj[website] || JSON.parse('false')
        sendResponse({
          customjs: customjs,
          host: window.location.host,
          protocol: window.location.protocol
        })
      })
      break
    case 'removeData':
      chrome.storage.sync.remove(website, function () {})
      break
    case 'goTo':
      window.location = request.link
      break
    default:
      sendResponse({src: '', config: {}})
  }
  if (request.reload) {
    window.location.reload()
  }
})
