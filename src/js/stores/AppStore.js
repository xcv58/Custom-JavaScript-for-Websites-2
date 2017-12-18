import { action, computed, observable } from 'mobx'
import { encodeSource, decodeSource, getHosts, setHosts } from 'libs'
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
  @observable matchedHost = ''

  @observable error = null

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
    if (this.matchedHost && this.matchedHost.isRegex) {
      return `${key}-${this.matchedHost.pattern}`
    }
    return `${key}-${this.domain}`
  }

  @action
  init = ({ domain, isRegex, pattern }) => {
    chrome.runtime.sendMessage({ method: 'getData', domain, isRegex, pattern }, async (response) => {
      if (!response || typeof response.host !== 'string') {
        throw new Error('Get no data for active tab!')
      }

      const { customjs, host, matchedHost, protocol, tab } = response
      Object.assign(this, {
        truth: customjs,
        host,
        matchedHost,
        protocol,
        tab
      })

      this.hosts = await getHosts(key)
      this.loadDraft()

      if (!matchedHost) {
        if (isRegex) {
          this.error = `There is no pattern of "${pattern}"`
          return
        } else {
          this.hosts.push(this.domain)
          this.saveHosts()
          return this.init({ domain, isRegex, pattern })
        }
      }

      if (isEqual(this.draft, this.truth)) {
        this.draft = null
      }
      this.loadCustomjs(this.draft || this.truth)
    })
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
    this.error = ''
    this.loading = false
  }

  saveHosts = async (hosts = this.hosts) => {
    setHosts(hosts.slice())
  }

  loadDraft = () => {
    const { draft } = JSON.parse(window.localStorage.getItem(this.domainKey) || '{}')
    this.draft = draft
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
    const { domain, customjs, matchedHost } = this
    chrome.runtime.sendMessage({
      method: 'setData',
      domain,
      matchedHost,
      customjs,
      reload: true
    })
  }

  @action
  reset = () => {
    this.loadCustomjs()
    const message = {
      method: 'removeData',
      domain: this.domain,
      reload: true
    }
    let newHosts
    if (typeof this.matchedHost === 'string') {
      newHosts = this.hosts.filter(x => x !== this.domain)
    } else {
      Object.assign(message, this.matchedHost)
      newHosts = this.hosts.filter(x => !x.isRegex || (x.pattern !== this.matchedHost.pattern))
    }
    this.saveHosts(newHosts)
    chrome.runtime.sendMessage(message)
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
