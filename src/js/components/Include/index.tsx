import React from 'react'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import Extra from './Extra'
import { useStore } from '../StoreContext'
import { observer } from 'mobx-react'

export default observer(() => {
  const {
    include,
    includes,
    toggleExtraOpen,
    onSelect
  } = useStore().IncludeStore
  const options = includes.map(({ name, path }) => (
    <MenuItem key={name} value={path}>
      {name}
    </MenuItem>
  ))
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <InputLabel>You can inject</InputLabel>
        <Button
          color='primary'
          onClick={toggleExtraOpen}
          style={{ padding: 0, margin: '0 0.5rem' }}
        >
          your own external scripts
        </Button>
        <InputLabel>or predefined one: </InputLabel>
        <FormControl>
          <Select
            value={include}
            displayEmpty
            autoWidth
            onChange={e => onSelect(e.target.value)}
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {options}
          </Select>
        </FormControl>
      </div>
      <Extra />
    </>
  )
})
