import React from 'react'
import Button from '@material-ui/core/Button'
import queryString from 'query-string'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'
import { Link } from 'react-router-dom'

export default observer(() => {
  const { tabMode, domain, matchedHost } = useStore().AppStore
  if (tabMode) {
    return null
  }
  const query = typeof matchedHost === 'string' ? { domain } : matchedHost
  const to = {
    pathname: '/',
    search: queryString.stringify(query)
  }
  return (
    <Link to={to} target='_blank'>
      <Button color='primary'>Open in New Tab</Button>
    </Link>
  )
})
