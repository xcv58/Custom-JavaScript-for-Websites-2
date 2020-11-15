import { action, computed, observable, makeObservable } from 'mobx'
import Store from 'stores'

const hint =
  '# Uncomment address of script below or type your own (one per line)'
const underscore =
  '# //cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js;'

export default class IncludeStore {
  store: Store

  constructor (store) {
    makeObservable(this, {
      extraOpen: observable,
      extra: observable,
      include: observable,
      includes: observable,
      extraValue: computed,
      placeholder: computed,
      onSelect: action,
      toggleExtraOpen: action,
      onUpdateExtra: action
    })

    this.store = store
  }

  extraOpen = false

  extra = ''

  include = ''

  includes = [
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
    },
    {
      name: 'Indefinite Observable 1.0.1',
      path: '/indefinite-observable/1.0.1/indefinite-observable.js'
    },
    {
      name: 'MooTools 1.6.0',
      path: '/mootools/1.6.0/mootools.min.js'
    }
  ]

  get extraValue () {
    return (this.extra || '').replace(';', '\n')
  }

  get placeholder () {
    return hint + '\n' + underscore
  }

  onSelect = (include) => {
    this.include = include
    this.store.AppStore.autoSave()
  }

  toggleExtraOpen = () => {
    this.extraOpen = !this.extraOpen
  }

  onUpdateExtra = (value = '') => {
    this.extra = value.replace('\n', ';')
    this.store.AppStore.autoSave()
  }
}
