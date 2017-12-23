import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Button from 'material-ui/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'

const issueLink = 'https://github.com/xcv58/Custom-JavaScript-for-Websites-2/issues/32'
const chromeDocLink = 'https://developer.chrome.com/apps/storage#property-sync'

@inject('AppStore')
@observer
export default class Size extends Component {
  handleClose = () => {
    window.location.reload()
  }

  render () {
    const { saveError, size } = this.props.AppStore
    const alert = saveError && (
      <Dialog open onClose={this.handleClose}>
        <DialogTitle>Script Save Failure</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Failed to save your script, it's usually because your script is
            too large to store in <a href={chromeDocLink} target='_blank' rel='noopener noreferrer'>
              chrome.storage.sync
            </a>. Please reduce your script size and try again!
          </DialogContentText>
          <DialogContentText>
            We know this problem and try to fix it, please follow <a
              href={issueLink} target='_blank' rel='noopener noreferrer'>
              this issue
            </a> if you want.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color='primary' autoFocus>
            Refresh
          </Button>
        </DialogActions>
      </Dialog>
    )
    return (
      <span>{size} bytes{alert}</span>
    )
  }
}
