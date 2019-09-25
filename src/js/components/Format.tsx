import React from 'react'
import Button from '@material-ui/core/Button'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'

export default observer(() => {
  const { beautify } = useStore().AppStore
  return (
    <Button color='primary' onClick={beautify}>
      Format
    </Button>
  )
})
