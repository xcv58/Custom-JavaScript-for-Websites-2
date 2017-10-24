import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('AppStore')
@observer
export default class NewTabLink extends Component {
  render () {
    const { saved, autoSaveHandle } = this.props.AppStore
    const text = (autoSaveHandle && 'Saving...') || (saved && 'Draft saved')
    return (
      <div className='pure-u-1-6 include__body'>
        <span>
          {text}
        </span>
      </div>
    )
  }
}
