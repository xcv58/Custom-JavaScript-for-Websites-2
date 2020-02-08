import React, { useState } from 'react'
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

export default observer(({ closePopup }) => {
  const [open, setOpen] = useState(false)
  const { AppStore } = useStore()
  const { target } = AppStore
  const closeDialog = () => setOpen(false)

  return [
    <Button onClick={() => setOpen(true)} key='reset'>
      Reset
    </Button>,
    <Dialog open={open} onClose={closeDialog} key='dialog'>
      <DialogTitle>Remove all codes and external scripts?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Reset will remove your codes and external scripts, and delete current
          domain/pattern: "{target}".
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button
          color='primary'
          onClick={() => {
            AppStore.removeHost()
            closeDialog()
            closePopup()
          }}
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  ]
})
