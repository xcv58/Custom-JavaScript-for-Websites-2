import React from 'react'
import Button from '@material-ui/core/Button'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'

export default observer(({ onSave }) => {
  const { AppStore } = useStore()
  const { differentURL, tabMode } = AppStore
  return (
    <Button
      color='primary'
      disabled={differentURL && !tabMode}
      onClick={onSave}
    >
      Save
    </Button>
  )
})
