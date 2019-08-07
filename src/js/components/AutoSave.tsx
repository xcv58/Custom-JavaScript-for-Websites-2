import React from 'react'
import { CircularProgress, InputLabel } from '@material-ui/core'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'

export default observer(() => {
  const { AppStore } = useStore()
  const { saved, autoSaveHandle } = AppStore
  const content =
    (autoSaveHandle && <CircularProgress size={24} />) ||
    (saved && <InputLabel>Draft saved</InputLabel>)
  return <span>{content}</span>
})
