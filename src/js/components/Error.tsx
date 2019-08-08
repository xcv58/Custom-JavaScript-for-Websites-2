import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core'
import Hosts from 'components/Hosts'

export default ({ error }) => (
  <Dialog open>
    <DialogTitle>Invalid Pattern</DialogTitle>
    <DialogContent>
      <DialogContentText>
        The pattern in the URL is invalid, details: <strong>{error}</strong>.
        Please choose a valid host from below or click the extension icon in the
        webpage you want to inject:
      </DialogContentText>
      <Hosts />
    </DialogContent>
  </Dialog>
)
