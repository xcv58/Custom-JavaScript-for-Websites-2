import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('AppStore')
@observer
export default class Reset extends Component {
  onReset = (e) => {
    e.preventDefault()
    this.props.AppStore.reset()
  }

  render () {
    const { differentURL, tabMode } = this.props.AppStore
    return (
      <input onClick={this.onReset}
        disabled={differentURL && !tabMode}
        type='submit'
        className='controls__reset pure-button'
        value='reset'
      />
    )
  }
}
