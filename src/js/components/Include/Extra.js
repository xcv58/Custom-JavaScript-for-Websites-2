import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import TextField from 'material-ui/TextField'
import Button from 'material-ui/Button'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'

@inject('IncludeStore')
@observer
export default class Include extends Component {
  onUpdateExtra = (e) => {
    this.props.IncludeStore.onUpdateExtra(e.target.value)
  }

  render () {
    const {
      extraOpen, extraValue, placeholder, toggleExtraOpen
    } = this.props.IncludeStore
    return (
      <Dialog fullWidth open={extraOpen} onClose={toggleExtraOpen}>
        <DialogTitle>External Scripts</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={2}
            rowsMax={100}
            placeholder={placeholder}
            onChange={this.onUpdateExtra}
            margin='none'
            type='text'
            value={extraValue}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleExtraOpen} color='primary'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
