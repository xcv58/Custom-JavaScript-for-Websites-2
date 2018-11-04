import React from 'react'
import Button from 'material-ui/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'

export default () => {
  return (
    <Dialog open>
      <DialogTitle>Can not load data</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Can not load data, please try to open a new window and try again.
        </DialogContentText>
        <DialogActions>
          <Button onClick={() => window.close()}>Cancel</Button>
          <Button color='primary' onClick={() => {
            chrome.windows.create({}, () => {
              window.close()
            })
          }}>Open new window</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
