import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Button from 'material-ui/Button'

@inject('AppStore')
@observer
export default class Goto extends Component {
  render () {
    const { differentURL, goTo } = this.props.AppStore
    if (!differentURL) {
      return null
    }
    return (
      <Button color='primary' onClick={goTo}>Go to</Button>
    )
  }
}
