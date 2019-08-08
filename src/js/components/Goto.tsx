import React from 'react'
import Button from '@material-ui/core/Button'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'

export default observer(() => {
  const { differentURL, goTo } = useStore().AppStore
  if (!differentURL) {
    return null
  }
  return (
    <Button color='primary' onClick={goTo}>
      Go to
    </Button>
  )
})
