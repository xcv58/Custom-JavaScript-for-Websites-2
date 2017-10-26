import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { MenuItem } from 'material-ui/Menu'
import { FormControl } from 'material-ui/Form'
import Select from 'material-ui/Select'

@inject('AppStore')
@observer
export default class Hosts extends Component {
  onSelectHost = (e) => {
    const { value } = e.target
    this.props.history.push(`?domain=${value}`)
  }

  render () {
    const { hosts, domain } = this.props.AppStore
    const options = hosts.map((host) => (
      <MenuItem key={host} value={host}>{host}</MenuItem>
    ))
    return (
      <FormControl>
        <Select value={domain}
          onChange={this.onSelectHost}>
          {options}
        </Select>
      </FormControl>
    )
  }
}
