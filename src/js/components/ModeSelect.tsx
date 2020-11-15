import React from 'react'
import { FormControl, MenuItem, Select } from '@material-ui/core'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'

export default observer(() => {
  const { mode, setMode } = useStore().AppStore
  const options = ['javascript', 'css'].map((option) => {
    return (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    )
  })
  return (
    <FormControl>
      <Select
        value={mode}
        onChange={(e) => {
          const value = e.target.value
          setMode(value)
        }}
      >
        {options}
      </Select>
    </FormControl>
  )
})
