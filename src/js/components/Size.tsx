import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'

const issueLink =
  'https://github.com/xcv58/Custom-JavaScript-for-Websites-2/issues/32'
const storageSyncDocLink =
  'https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/sync'

export default observer(() => {
  const { clearSaveError, saveError, size } = useStore().AppStore
  const alert = saveError && (
    <Dialog open onClose={clearSaveError}>
      <DialogTitle>Script Save Failure</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Failed to save your script, it's usually because your script is too
          large to store in{' '}
          <a
            href={storageSyncDocLink}
            target='_blank'
            rel='noopener noreferrer'
          >
            storage.sync
          </a>
          . Please reduce your script size and try again!
        </DialogContentText>
        <DialogContentText>
          We know this problem and try to fix it, please follow{' '}
          <a href={issueLink} target='_blank' rel='noopener noreferrer'>
            this issue
          </a>{' '}
          if you want.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={clearSaveError} color='primary' autoFocus>
          Try again
        </Button>
      </DialogActions>
    </Dialog>
  )
  return (
    <span>
      {size} bytes{alert}
    </span>
  )
})
