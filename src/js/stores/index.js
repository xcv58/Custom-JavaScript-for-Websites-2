import AppStore from './AppStore'
import IncludeStore from './IncludeStore'

export default class Store {
  constructor () {
    Object.entries({
      AppStore,
      IncludeStore
    }).forEach(([ key, Value ]) => {
      this[key] = new Value(this)
    })
  }
}
