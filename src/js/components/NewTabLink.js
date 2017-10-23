import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('AppStore')
@observer
export default class NewTabLink extends Component {
  render () {
    const { tabMode, domain } = this.props.AppStore
    if (tabMode) {
      return null
    }
    const href = `${chrome.runtime.getURL('popup.html')}?domain=${domain}`
    return (
      <a href={href} target='_blank' className='pure-button-primary pure-button controls__new-tab'>
        new tab
      </a>
    )
  }
}
