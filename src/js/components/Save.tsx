import React from 'react'
import Button from '@material-ui/core/Button'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'

export default observer(({ onSave }) => {
  const { differentURL, tabMode, saved, draft } = useStore().AppStore
  return (
    <Button
      color={saved || draft ? 'secondary' : 'primary'}
      disabled={differentURL && !tabMode}
      onClick={onSave}
    >
      Save
    </Button>
  )
})
