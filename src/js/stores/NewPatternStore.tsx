import { action, computed, observable, makeObservable } from 'mobx'
import Store from 'stores'

export default class NewPatternStore {
  store: Store
  re: RegExp

  constructor (store) {
    makeObservable(this, {
      open: observable,
      pattern: observable,
      validPattern: computed,
      host: computed,
      error: computed,
      setPattern: action,
      addToHosts: action,
      closeDialog: action,
      openDialog: action
    })

    this.store = store
  }

  open = false

  pattern = ''

  get validPattern () {
    return !this.error
  }

  get host () {
    return {
      isRegex: true,
      pattern: this.pattern
    }
  }

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
    if (
      hosts.find(
        (x) => typeof x === 'object' && x.isRegex && x.pattern === this.pattern
      )
    ) {
      return `Pattern ${this.pattern} already exists`
    }
  }

  setPattern = (value) => {
    this.pattern = value
  }

  addToHosts = () => {
    if (this.error) {
      throw new Error(`addToHost failed, pattern "${this.pattern}" is invalid!`)
    }
    const { hosts, saveHosts } = this.store.AppStore
    hosts.push(this.host)
    saveHosts()
    this.closeDialog()
  }

  closeDialog = () => {
    this.open = false
    this.clear()
  }

  openDialog = () => {
    this.clear()
    this.open = true
  }

  clear = () => {
    this.pattern = ''
  }
}
