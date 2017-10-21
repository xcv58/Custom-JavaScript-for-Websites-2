import $ from 'jquery'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import Editor from 'components/Editor'
import Store from 'stores'
import { encodeSource, decodeSource } from 'libs'

const store = new Store()
const storage = {
  hosts: [],
  data: '',
  draft: '',
  setDraft: function (draft = '') {
    this.draft = draft
    this.saveToLocalStorage()
  },
  getDraft: function () {
    return this.draft
  },
  removeDraft: function () {
    this.draft = ''
    this.saveToLocalStorage()
  },
  setData: function (data = '') {
    this.data = data
    this.saveToLocalStorage()
  },
  getData: function () {
    return this.data
  },
  getHosts: function () {
    return this.hosts
  },
  setHosts: function (hosts = []) {
    this.hosts = hosts
    const hostsStr = JSON.stringify({ hosts: this.hosts })
    window.localStorage.setItem(popup.key, hostsStr)
  },
  saveToLocalStorage: function () {
    const key = popup.key + '-' + popup.protocol + '//' + popup.host
    const str = JSON.stringify({
      data: this.data,
      draft: this.draft
    })
    window.localStorage.setItem(key, str)
  },
  load: function () {
    const key = popup.key + '-' + popup.protocol + '//' + popup.host
    const { data, draft } = JSON.parse(window.localStorage.getItem(key) || '{}')
    this.data = data
    this.draft = draft
    const { hosts } = JSON.parse(window.localStorage.getItem(popup.key) || '{}')
    this.hosts = hosts
  },
  remove: function () {
    const key = popup.key + '-' + popup.protocol + '//' + popup.host
    window.localStorage.removeItem(key)
  }
}

const popup = {
  key: 'popup',
  el: {
    popup: $('#customjs'),
    popupForm: $('#popup-form'),
    hostSelect: $('#host'),
    hostGoToLink: $('#goto-host'),
    enableCheck: $('#enable'),
    includeOpenPopboxLink: $('#open-popbox'),
    includePopbox: $('#include-popbox'),
    includeSelect: $('#include'),
    includeTextarea: $('#extra-scripts'),
    includeMask: $('#screen-mask'),
    saveBtn: $('#save'),
    resetBtn: $('#reset'),
    draftRemoveLink: $('#draft-remove'),
    error: $('#error'),
    donateBtn: $('#donate'),
    donateForm: $('#donate-form')
  },
  title: {
    include: {
      textarea: 'Uncomment address of script below or type your own (one per line)'
    }
  },
  include: {
    predefined: [
      {
        name: 'jQuery 1.11.3',
        path: '/jquery/1.11.3/jquery.min.js'
      },
      {
        name: 'jQuery 2.1.4',
        path: '/jquery/2.1.4/jquery.min.js'
      }
    ],
    extra: [
      '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
    ]
  },
  host: undefined,
  emptyDataPattern: {
    config: {
      enable: false,
      include: '',
      extra: ''
    },
    source: ''
  },
  data: null,
  init: function () {
    chrome.runtime.sendMessage(
      { method: 'getData' },
      popup.onGetData
    )
  },
  onGetData: function (response) {
    if (!response || typeof response.host !== 'string') {
      popup.error()
      return
    }

      /**
      * Create 'hosts select'
      */

    popup.host = response.host
    popup.protocol = response.protocol

    // Load storage (global, local) IMPORTANT: Must be called first of all storage operations
    storage.load()

    const hosts = storage.getHosts()
    const url = popup.protocol + '//' + response.host

    // Add current host to list
    if (hosts.indexOf(url) === -1) {
      hosts.push(url)
    }

      // Fill 'hosts select'
    hosts.forEach(function (host) {
      var option = $('<option>' + host + '</option>')
      if (host === url) {
        option.attr('selected', 'selected')
      }
      popup.el.hostSelect.append(option)
    })

    // Store host (current included in array) if is customjs defined
    if (response.customjs) {
      storage.setHosts(hosts)
    }

    /**
     * Set-up data (script, enable, include, extra)
     */
    // Set-up data pattern if empty
    if (!popup.data) {
      popup.data = $.extend(true, {}, popup.emptyDataPattern)
    }

    // Merge host's data to defaults
    popup.data = $.extend(popup.data, response.customjs)

    popup.data.source = decodeSource(popup.data.source)

    // Save local copy of live data
    if (response.customjs) {
      storage.setData(popup.data)
    }

    // Apply data (draft if exist)
    popup.applyData(storage.getDraft())
  },
  applyData: function (data, notDraft) {
    if (data && !notDraft) {
      this.el.draftRemoveLink.removeClass('is-hidden')
    }

    data = data || this.data

    // Default value for 'extra include'
    if (!data.config.extra) {
      data.config.extra = '# ' + popup.title.include.textarea + '\n'
      popup.include.extra.forEach(function (url) {
        data.config.extra += '# ' + url + '\n'
      })
    } else {
      // Readable format for 'extra include'
      data.config.extra = data.config.extra.replace(';', '\n')
    }

    // Default value for source
    if (!data.source) {
      data.source = store.EditorStore.value
    }

    // Set 'predefined include' value
    popup.el.includeSelect.val(data.config.include)

    // Set enable checkbox
    popup.el.enableCheck.prop('checked', data.config.enable)

    // Fill 'extra include' textarea
    popup.el.includeTextarea.val(data.config.extra)

    // Apply source into editor
    store.EditorStore.setValue(data.source)
  },
  getCurrentData: function () {
    return {
      config: {
        enable: popup.el.enableCheck.prop('checked'),
        include: popup.el.includeSelect.val(),
        extra: popup.el.includeTextarea.val()
      },
      source: store.EditorStore.value
    }
  },
  removeDraft: function () {
    storage.removeDraft()

    popup.applyData()
    popup.el.draftRemoveLink.addClass('is-hidden')
  },
  save: function (e) {
    e.preventDefault()

    // Is allowed to save?
    if (popup.el.saveBtn.hasClass('pure-button-disabled')) {
      return false
    }

    var data = popup.getCurrentData()

    // Transform source for correct apply
    data.config.extra = data.config.extra.replace('\n', ';')
    data.source = encodeSource(data.source)

    // Send new data to apply
    chrome.runtime.sendMessage({ method: 'setData', customjs: data, reload: true })

    // Save local copy of data
    storage.setData(popup.data)

    // Clear draft
    popup.removeDraft()

    // Close popup
    window.close()
  },
  reset: function (e) {
    e.preventDefault()

    // Is allowed to reset?
    if (popup.el.resetBtn.hasClass('pure-button-disabled')) {
      return false
    }

    // TODO: confirm doesn't work with popup window
    // if (window.confirm('Do you really want all away?')) {
    // Remove stored data for current host
    storage.remove()

    // Remove host from hosts inside global storage
    const oldHosts = storage.getHosts()
    const newHosts = oldHosts.filter((host) => host !== `${popup.protocol}//${popup.host}`)
    storage.setHosts(newHosts)

    // Remove customjs from frontend
    chrome.runtime.sendMessage({ method: 'removeData' })

    // Set-up empty data
    popup.data = $.extend(true, {}, popup.emptyDataPattern)
    popup.applyData()

    popup.removeDraft()
    store.EditorStore.setDefaultValue()
    // }

    return false
  },
  error: function () {
    popup.el.popup.addClass('customjs--error')
    popup.el.error.removeClass('is-hidden')
  }
}

window.popup = popup

/**
* Click to goTo host link
*/
popup.el.hostGoToLink.on('click', function () {
  var link = popup.el.hostSelect.val()
  chrome.runtime.sendMessage({ method: 'goTo', link: link })
  window.close()
})

/**
* Fill predefined libs to include
*/

popup.include.predefined.forEach(function (lib) {
  var option = '<option value="' + lib.path + '">' + lib.name + '</option>'
  popup.el.includeSelect.append(option)
})

/**
* Initialize Ace Editor
*/

const initEditor = () => {
  render(
    <Provider {...store}>
      <Editor />
    </Provider>,
    document.getElementById('ace-editor')
  )
}
initEditor()

popup.init()

/**
* 'Include extra scripts' control
*/

popup.el.includeOpenPopboxLink.on('click', function () {
  popup.el.includePopbox.removeClass('is-hidden')
})

popup.el.includeMask.on('click', function () {
  popup.el.includePopbox.addClass('is-hidden')
})

/**
* Auto save draft
*/

const draftAutoSave = function () {
  const draft = popup.getCurrentData()
  const source = draft.source

  if ((source || !popup.data.source) && source !== popup.data.source) {
    storage.setDraft(draft)

    // Auto switch 'enable checkbox' on source edit
    if (!popup.el.enableCheck.hasClass('not-auto-change')) {
      popup.el.enableCheck.prop('checked', true)
    }
  }
}
let draftAutoSaveInterval = setInterval(draftAutoSave, 2000)

/**
* Change host by select
*/

popup.el.hostSelect.on('change', function (e) {
  const host = $(this).val()
  const hostData = JSON.parse(window.localStorage.getItem(popup.key + '-' + host), true)

  if (host !== popup.protocol + '//' + popup.host) {
    // storage.load()
    // Stop making drafts
    clearInterval(draftAutoSaveInterval)

    // Show goto link
    popup.el.hostGoToLink.removeClass('is-hidden')

    // Hide controls
    popup.el.saveBtn.addClass('pure-button-disabled')
    popup.el.resetBtn.addClass('pure-button-disabled')
    popup.el.draftRemoveLink.addClass('is-hidden')

    // Apply other host data
    try {
      popup.applyData(hostData.data, true)
    } catch (err) {
      // Hotfix for host without customjs
      popup.applyData($.extend(true, {}, popup.emptyDataPattern), true)
    }
  } else {
    // Start making drafts
    draftAutoSaveInterval = setInterval(draftAutoSave, 2000)

    // Hide goto link
    popup.el.hostGoToLink.addClass('is-hidden')

    // Show controls
    popup.el.saveBtn.removeClass('pure-button-disabled')
    popup.el.resetBtn.removeClass('pure-button-disabled')
    if (storage.getDraft()) {
      popup.el.draftRemoveLink.removeClass('is-hidden')
    }

    // Apply current host data
    popup.applyData(hostData.draft || hostData.data, !hostData.draft)
  }
})

/**
 * Protect 'enable checkbox' if was manually modified
 */
popup.el.enableCheck.on('click', function () {
  $(this).addClass('not-auto-change')
})

/**
 * Save script
 */
popup.el.saveBtn.on('click', popup.save.bind(popup))

/**
 * Reset script
 */
popup.el.resetBtn.on('click', popup.reset)

/**
 * Remove draft
 */
popup.el.draftRemoveLink.on('click', popup.removeDraft)

/**
 * Donate
 */
var donate = {
  button: popup.el.donateBtn,
  form: popup.el.donateForm
}

donate.button.on('click', function (e) {
  donate.form.find('input[name="submit"]').click()
  e.preventDefault()
})
