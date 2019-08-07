import AppStore from './AppStore'
import IncludeStore from './IncludeStore'
import NewPatternStore from './NewPatternStore'

export default class Store {
  AppStore: AppStore

  IncludeStore: IncludeStore

  NewPatternStore: NewPatternStore

  constructor () {
    this.AppStore = new AppStore(this)
    this.IncludeStore = new IncludeStore(this)
    this.NewPatternStore = new NewPatternStore(this)
  }
}
