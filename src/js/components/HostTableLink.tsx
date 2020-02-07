import React from 'react'
import Button from '@material-ui/core/Button'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'

export default observer(() => {
  const { tabMode } = useStore().AppStore
  if (!tabMode) {
    return null
  }
  return (
    <Link to='/list'>
      <Button color='primary'>Hosts Table</Button>
    </Link>
  )
})
