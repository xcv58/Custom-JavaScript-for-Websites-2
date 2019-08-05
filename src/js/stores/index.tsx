import AppStore from './AppStore'
import IncludeStore from './IncludeStore'
import NewPatternStore from './NewPatternStore'

export default class Store {
  constructor () {
    Object.entries({
      AppStore,
      IncludeStore,
      NewPatternStore
    }).forEach(([ key, Value ]) => {
      this[key] = new Value(this)
    })
  }
}
