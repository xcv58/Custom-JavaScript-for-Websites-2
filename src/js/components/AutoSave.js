import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { CircularProgress } from 'material-ui/Progress'
import { InputLabel } from 'material-ui/Input'

@inject('AppStore')
@observer
export default class NewTabLink extends Component {
  render () {
    const { saved, autoSaveHandle } = this.props.AppStore
    const content = (
      autoSaveHandle && <CircularProgress size={24} />
    ) || (
      saved && <InputLabel>Draft saved</InputLabel>
    )
    return (
      <span>
        {content}
      </span>
    )
  }
}
