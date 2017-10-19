import { action, observable } from 'mobx'

export default class TabStore {
  constructor (store) {
    this.store = store
    this.setDefaultValue()
  }

  @observable value = ''

  @action
  setDefaultValue = () => {
    this.value = '// Here You can type your custom JavaScript...'
  }

  @action
  setValue = (value) => {
    this.value = value
  }

  @action
  onChange = (value) => {
    this.value = value
  }
}
