import React from 'react'
import Button from '@material-ui/core/Button'
import queryString from 'query-string'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'

export default observer(() => {
  const { AppStore } = useStore()

  const { tabMode, domain, isRegex, target: pattern } = AppStore
  if (tabMode) {
    return null
  }
  const query = isRegex ? { isRegex, pattern } : { domain }
  const href = `${chrome.runtime.getURL('popup.html')}?${queryString.stringify(
    query
  )}`
  return (
    <Button href={href} target='_blank'>
      Open in New Tab
    </Button>
  )
})
