import { action, computed, observable } from 'mobx'
import { encodeSource, decodeSource } from 'libs'
import isEqual from 'lodash.isequal'

const key = 'popup'
const defaultSource = '// Here You can type your custom JavaScript...'

export default class AppStore {
  constructor (store) {
    this.store = store
  }

  @observable loading = true

  @observable autoSaveHandle = null
  @observable saved = false

  @observable hosts = []

  @observable enable = false
  @observable source = defaultSource

  @observable draft = null
  @observable truth = null

  @observable tab = { url: '' }
  @observable host = ''
  @observable protocol = ''

  @computed
  get include () {
    return this.store.IncludeStore.include
  }

  @computed
  get extra () {
    return this.store.IncludeStore.extra
  }

  @computed
  get domain () {
    return `${this.protocol}//${this.host}`
  }

  @computed
  get differentURL () {
    return !this.tab.url.startsWith(this.domain)
  }

  @computed
  get tabMode () {
    return this.tab.url === window.location.href
  }

  @computed
  get customjs () {
    return {
      config: {
        enable: this.enable,
        include: this.include,
        extra: this.extra
      },
      source: encodeSource(this.source)
    }
  }

  @computed
  get domainKey () {
    return `${key}-${this.domain}`
  }

  @action
  init = (domain) => {
    chrome.runtime.sendMessage({ method: 'getData', domain }, (response) => {
      if (!response || typeof response.host !== 'string') {
        throw new Error('Get no data for active tab!')
      }

      const { customjs, host, protocol, tab } = response
      Object.assign(this, {
        truth: customjs,
        host,
        protocol,
        tab
      })

      this.loadLocalStorage()

      const hostExist = this.hosts.includes(this.domain)
      if (!hostExist) {
        this.hosts.push(this.domain)
        this.saveHosts()
      }

      if (isEqual(this.draft, this.truth)) {
        this.draft = null
      }
      this.loadCustomjs(this.draft || this.truth)
    })
  }

  saveHosts = (hosts = this.hosts) => {
    window.localStorage.setItem(key, JSON.stringify({ hosts }))
  }

  loadCustomjs = (customjs = { config: {} }) => {
    const {
      source = defaultSource,
      config: {
        enable = false,
        include = '',
        extra = this.store.IncludeStore.placeholder
      } = {}
    } = customjs
    Object.assign(this, { enable, source: decodeSource(source) })
    Object.assign(this.store.IncludeStore, { include, extra })
    this.loading = false
  }

  loadLocalStorage = () => {
    const { draft } = JSON.parse(window.localStorage.getItem(this.domainKey) || '{}')
    const { hosts = [] } = JSON.parse(window.localStorage.getItem(key) || '{}')
    Object.assign(this, { draft, hosts })
  }

  @action
  saveDraft = () => {
    this.draft = this.customjs
    window.localStorage.setItem(
      this.domainKey,
      JSON.stringify({ draft: this.draft })
    )
    this.saved = true
    this.autoSaveHandle = null
  }

  @action
  removeDraft = () => {
    this.draft = null
    this.saved = false
    window.localStorage.removeItem(this.domainKey)
  }

  @action
  onChangeSource = (value) => {
    this.source = value
    if (!this.enable) {
      this.enable = true
    }
    this.autoSave()
  }

  @action
  onHostChange = (newHost) => {
    this.init(newHost)
  }

  @action
  onRemoveDraft = () => {
    this.removeDraft()
    this.loadCustomjs(this.truth)
  }

  @action
  toggleEnable = () => {
    this.enable = !this.enable
    this.autoSave()
  }

  @action
  save = () => {
    this.removeDraft()
    const { domain, customjs } = this
    chrome.runtime.sendMessage({
      method: 'setData',
      domain,
      customjs,
      reload: true
    })
  }

  @action
  reset = () => {
    // TODO: confirm doesn't work with popup window
    this.loadCustomjs()
    chrome.runtime.sendMessage({
      method: 'removeData',
      domain: this.domain,
      reload: true
    })
    const newHosts = this.hosts.filter(x => x !== this.domain)
    this.saveHosts(newHosts)
    this.removeDraft()
  }

  @action
  goTo = () => {
    chrome.runtime.sendMessage({ method: 'goTo', link: this.domain })
  }

  autoSave = () => {
    if (this.autoSaveHandle) {
      clearTimeout(this.autoSaveHandle)
    }
    this.autoSaveHandle = setTimeout(this.saveDraft, 500)
  }
}
