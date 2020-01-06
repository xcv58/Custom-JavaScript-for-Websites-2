import React from 'react'
import { CircularProgress, InputLabel } from '@material-ui/core'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'

export default observer(() => {
  const { saved, autoSaveHandle } = useStore().AppStore
  const content =
    (autoSaveHandle && <CircularProgress size={24} />) ||
    (saved && (
      <InputLabel>Draft saved. Click "Save" to apply the script.</InputLabel>
    ))
  return <span>{content}</span>
})
