import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { FormGroup, FormControlLabel } from 'material-ui/Form'
import Switch from 'material-ui/Switch'

@inject('AppStore')
@observer
export default class Toggle extends Component {
  render () {
    const { enable, toggleEnable } = this.props.AppStore
    return (
      <FormGroup>
        <FormControlLabel
          label={
            <span>Enable <em className='blue-text'>cjs</em> for this host</span>
          }
          control={
            <Switch checked={enable} onChange={toggleEnable} />
          }
        />
      </FormGroup>
    )
  }
}
