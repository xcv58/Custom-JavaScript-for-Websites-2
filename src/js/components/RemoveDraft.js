import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Button from 'material-ui/Button'

@inject('AppStore')
@observer
export default class RemoveDraft extends Component {
  render () {
    const { draft, onRemoveDraft } = this.props.AppStore
    if (!draft) {
      return null
    }
    return (
      <Button color='accent' onClick={onRemoveDraft}>
        Remove Draft
      </Button>
    )
  }
}
