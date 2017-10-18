import EditorStore from './EditorStore'

export default class Store {
  constructor () {
    this.EditorStore = new EditorStore(this)
  }
}
