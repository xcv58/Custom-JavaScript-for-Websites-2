import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { MenuItem } from 'material-ui/Menu'
import { FormControl } from 'material-ui/Form'
import Select from 'material-ui/Select'
import { getHostKey } from 'libs'
import { withRouter } from 'react-router'
import queryString from 'queryString'

@withRouter
@inject('AppStore')
@observer
export default class Hosts extends Component {
  onSelectHost = (e) => {
    const value = JSON.parse(e.target.value)
    const query = {}
    if (typeof value === 'string') {
      query.domain = value
    } else {
      Object.assign(query, value)
    }
    this.props.history.push(`?${queryString.stringify(query)}`)
  }

  render () {
    const { hosts, matchedHost = '' } = this.props.AppStore
    const options = hosts.map((host) => {
      const key = getHostKey(host)
      const { isRegex } = host
      return (
        <MenuItem key={key} value={JSON.stringify(host)}>
          {isRegex && 'RegExp:'} {key}
        </MenuItem>
      )
    })
    return (
      <FormControl>
        <Select value={JSON.stringify(matchedHost)}
          onChange={this.onSelectHost}>
          {options}
        </Select>
      </FormControl>
    )
  }
}
