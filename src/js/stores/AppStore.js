import { action, computed, observable } from 'mobx'
import { encodeSource, decodeSource } from 'libs'

const key = 'popup'
const defaultSource = '// Here You can type your custom JavaScript...'

export default class AppStore {
  constructor (store) {
    this.store = store
  }

  autoSaveHandle = null

  @observable hosts = []

  @observable enable = false
  @observable source = defaultSource

  @observable draft = ''
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
      this.host = host
      this.protocol = protocol
      this.tab = tab
      this.loadLocalStorage()
      const hostExist = this.hosts.includes(this.domain)
      if (!hostExist) {
        this.hosts.push(this.domain)
      }
      if (customjs) {
        this.loadCustomjs(customjs)
        // Store host (current included in array) if is customjs defined
        if (!hostExist) {
          this.saveHosts()
        }
        // Save local copy of live data
        this.saveToLocalStorage()
      }

      if (this.source === this.draft) {
        this.draft = ''
      }
    })
  }

  saveHosts = (hosts = this.hosts) => {
    const hostsStr = JSON.stringify({ hosts })
    window.localStorage.setItem(key, hostsStr)
  }

  loadCustomjs = (customjs = { config: {} }) => {
    const {
      source = defaultSource,
      config: {
        enable = false,
        include = '',
        extra = ''
      }
    } = customjs
    Object.assign(this, {
      enable,
      source: decodeSource(source)
    })
    this.store.IncludeStore.onSelect(include)
    this.store.IncludeStore.extra = extra
  }

  loadLocalStorage = () => {
    const { data, draft } = JSON.parse(window.localStorage.getItem(this.domainKey) || '{}')
    this.loadCustomjs(data)
    this.draft = draft
    const { hosts } = JSON.parse(window.localStorage.getItem(key) || '{}')
    this.hosts = hosts
  }

  @action
  saveToLocalStorage = () => {
    const str = JSON.stringify({
      data: this.data,
      draft: this.draft || this.source
    })
    window.localStorage.setItem(this.domainKey, str)
  }

  @action
  onChangeSource = (value) => {
    if (this.draft) {
      this.draft = ''
    }
    this.source = value
    if (!this.enable) {
      this.enable = true
    }
    if (this.autoSaveHandle) {
      clearTimeout(this.autoSaveHandle)
      this.autoSaveHandle = null
    }
    this.autoSaveHandle = setTimeout(this.saveToLocalStorage, 500)
  }

  @action
  onHostChange = (newHost) => {
    this.init(newHost)
  }

  @action
  onRemoveDraft = () => {
    this.draft = ''
    this.saveToLocalStorage()
  }

  @action
  toggleEnable = () => {
    this.enable = !this.enable
  }

  @action
  save = () => {
    // Clear draft
    this.source = this.draft || this.source
    this.draft = ''
    const { domain, customjs } = this
    chrome.runtime.sendMessage({
      method: 'setData',
      domain,
      customjs,
      reload: true
    })
    this.saveToLocalStorage()
  }

  @action
  reset = () => {
    // TODO: confirm doesn't work with popup window
    this.draft = ''
    this.loadCustomjs()
    this.save()
    const newHosts = this.hosts.filter(x => x !== this.domain)
    this.saveHosts(newHosts)
  }
}
