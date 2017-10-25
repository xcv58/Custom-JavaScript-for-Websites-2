import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Button from 'material-ui/Button'
import Dialog, {
  DialogActions, DialogContent, DialogContentText, DialogTitle
} from 'material-ui/Dialog'

@inject('AppStore')
@observer
export default class Reset extends Component {
  state = { open: false }

  openDialog = () => this.setState({ open: true })

  closeDialog = () => this.setState({ open: false })

  handleReset = () => {
    this.props.AppStore.reset()
    this.closeDialog()
  }

  render () {
    const { domain } = this.props.AppStore
    return [
      <Button raised onClick={this.openDialog} key='reset'>
        Reset
      </Button>,
      <Dialog open={this.state.open} onRequestClose={this.closeDialog} key='dialog'>
        <DialogTitle>Remove all codes and external scripts?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Reset will remove your codes and external scripts, and delete
            current domain: {domain} from domain lists.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button raised onClick={this.closeDialog}>
            Cancel
          </Button>
          <Button raised color='primary' onClick={this.handleReset}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    ]
  }
}
