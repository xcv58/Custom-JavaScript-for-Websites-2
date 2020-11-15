import React from 'react'
import { getHostName } from 'libs'
import { useHistory } from 'react-router-dom'
import queryString from 'query-string'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'
import { MenuItem, FormControl, Select } from '@material-ui/core'

export default observer((props) => {
  const history = useHistory()
  const { hosts, matchedHost = '' } = useStore().AppStore
  const options = hosts.map((host) => {
    const name = getHostName(host)
    return (
      <MenuItem key={name} value={JSON.stringify(host)}>
        {name}
      </MenuItem>
    )
  })
  return (
    <FormControl>
      <Select
        value={JSON.stringify(matchedHost)}
        onChange={(e) => {
          const value = JSON.parse(e.target.value)
          const query = {}
          if (typeof value === 'string') {
            query.domain = value
          } else {
            Object.assign(query, value)
          }
          history.push(`?${queryString.stringify(query)}`)
        }}
      >
        {options}
      </Select>
    </FormControl>
  )
})
