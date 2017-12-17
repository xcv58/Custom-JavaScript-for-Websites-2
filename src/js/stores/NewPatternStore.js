import { action, computed, observable } from 'mobx'

export default class NewPatternStore {
  constructor (store) {
    this.store = store
  }

  @observable open = false
  @observable pattern = ''

  @computed
  get validPattern () {
    return !this.error
  }

  @computed
  get error () {
    if (!this.pattern) {
      return 'Empty Pattern'
    }
    try {
      this.re = new RegExp(this.pattern)
    } catch (err) {
      return err.message
    }
    const { hosts } = this.store.AppStore
    if (hosts.find(x => x.isRegex && (x.pattern === this.pattern))) {
      return `Pattern ${this.pattern} already exists`
    }
  }

  @action
  setPattern = (value) => {
    this.pattern = value
  }

  @action
  addToHost = () => {
    // TODO: add to host
    // this.extraOpen = !this.extraOpen
  }

  @action
  closeDialog = () => {
    this.open = false
    this.clear()
  }

  @action
  openDialog = () => {
    this.clear()
    this.open = true
  }

  clear = () => {
    this.pattern = ''
  }
}
