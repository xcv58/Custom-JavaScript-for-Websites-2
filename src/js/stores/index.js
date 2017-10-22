import AppStore from './AppStore'
import IncludeStore from './IncludeStore'

export default class Store {
  constructor () {
    Object.entries({
      AppStore,
      IncludeStore
    }).map(([ key, Value ]) => {
      this[key] = new Value(this)
    })
  }
}
