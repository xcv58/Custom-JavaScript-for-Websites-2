import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Button from 'material-ui/Button'

@inject('AppStore')
@observer
export default class Save extends Component {
  render () {
    const { differentURL, tabMode } = this.props.AppStore
    return (
      <Button raised
        color='primary'
        value='save'
        disabled={differentURL && !tabMode}
        onClick={this.props.onSave}
      >Save</Button>
    )
  }
}
