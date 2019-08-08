import React from 'react'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'
import { FormGroup, FormControlLabel, Switch } from '@material-ui/core'

export default observer(() => {
  const { enable, toggleEnable } = useStore().AppStore
  return (
    <FormGroup>
      <FormControlLabel
        label={
          <span>
            Enable <em className='blue-text'>cjs</em> for this host
          </span>
        }
        control={
          <Switch color='primary' checked={enable} onChange={toggleEnable} />
        }
      />
    </FormGroup>
  )
})
