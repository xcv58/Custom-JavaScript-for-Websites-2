import { action, computed, observable } from 'mobx'

const hint = '# Uncomment address of script below or type your own (one per line)'
const underscore = '# //cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'

export default class includeStore {
  constructor (store) {
    this.store = store
  }

  @observable extraOpen = false
  @observable extra = ''
  @observable include = ''
  @observable includes = [
    {
      name: 'jQuery 1.12.4',
      path: '/jquery/1.12.4/jquery.min.js'
    },
    {
      name: 'jQuery 2.2.4',
      path: '/jquery/2.2.4/jquery.min.js'
    },
    {
      name: 'jQuery 3.2.1',
      path: '/jquery/3.2.1/jquery.min.js'
    }
  ]

  @computed
  get extraValue () {
    return (this.extra || '').replace(';', '\n')
  }

  @computed
  get placeholder () {
    return hint + '\n' + underscore
  }

  @action
  onSelect = (include) => {
    this.include = include
    this.store.AppStore.autoSave()
  }

  @action
  toggleExtraOpen = () => {
    this.extraOpen = !this.extraOpen
  }

  @action
  onUpdateExtra = (value = '') => {
    this.extra = value.replace('\n', ';')
    this.store.AppStore.autoSave()
  }
}
