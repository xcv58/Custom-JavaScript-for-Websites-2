import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { FormControl } from 'material-ui/Form'
import { MenuItem } from 'material-ui/Menu'
import Select from 'material-ui/Select'

@inject('AppStore')
@observer
export default class ModeSelect extends Component {
  onSelect = (e) => {
    const value = e.target.value
    this.props.AppStore.setMode(value)
  }

  render () {
    const { mode } = this.props.AppStore
    const options = ['javascript', 'css'].map((option) => {
      return (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      )
    })
    return (
      <FormControl>
        <Select value={mode}
          onChange={this.onSelect}>
          {options}
        </Select>
      </FormControl>
    )
  }
}
