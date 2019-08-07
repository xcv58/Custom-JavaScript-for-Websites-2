import React from 'react'
import { getHostKey } from 'libs'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'
import { MenuItem, FormControl, Select } from '@material-ui/core'

const Hosts = observer(props => {
  const { AppStore } = useStore()
  const { hosts, matchedHost = '' } = AppStore
  const options = hosts.map(host => {
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
      <Select
        value={JSON.stringify(matchedHost)}
        onChange={e => {
          const value = JSON.parse(e.target.value)
          const query = {}
          if (typeof value === 'string') {
            query.domain = value
          } else {
            Object.assign(query, value)
          }
          props.history.push(`?${queryString.stringify(query)}`)
        }}
      >
        {options}
      </Select>
    </FormControl>
  )
})

export default withRouter(Hosts)
