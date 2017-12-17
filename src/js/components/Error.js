import React, { Component } from 'react'
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import Hosts from 'components/Hosts'

export default class Error extends Component {
  render () {
    const { error } = this.props
    return (
      <Dialog open>
        <DialogTitle>Invalid Pattern</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The pattern in the URL is invalid, details: <strong>{error}</strong>.
            Please choose a valid host from below or click the extension icon in the webpage you
            want to inject:
          </DialogContentText>
          <Hosts {...this.props} />
        </DialogContent>
      </Dialog>
    )
  }
}
