import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Button from 'material-ui/Button'
import queryString from 'query-string'

@inject('AppStore')
@observer
export default class NewTabLink extends Component {
  render () {
    const { tabMode, domain, isRegex, target: pattern } = this.props.AppStore
    if (tabMode) {
      return null
    }
    const query = isRegex ? { isRegex, pattern } : { domain }
    const href = `${chrome.runtime.getURL('popup.html')}?${queryString.stringify(query)}`
    return (
      <Button href={href} target='_blank'>
        Open in New Tab
      </Button>
    )
  }
}
