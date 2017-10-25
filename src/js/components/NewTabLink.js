import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Button from 'material-ui/Button'

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
      <Button href={href} target='_blank'>
        Open in New Tab
      </Button>
    )
  }
}
