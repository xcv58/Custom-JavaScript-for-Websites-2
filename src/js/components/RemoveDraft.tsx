import React from 'react'
import Button from '@material-ui/core/Button'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'

export default observer(() => {
  const { draft, onRemoveDraft } = useStore().AppStore
  if (!draft) {
    return null
  }
  return (
    <Button color='secondary' onClick={onRemoveDraft}>
      Remove Draft
    </Button>
  )
})
