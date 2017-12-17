import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import queryString from 'query-string'

@inject('NewPatternStore')
@observer
export default class NewPattern extends Component {
  onChange = (event) => {
    const { setPattern } = this.props.NewPatternStore
    setPattern(event.target.value)
  }

  onAdd = () => {
    const { addToHosts, host } = this.props.NewPatternStore
    addToHosts()
    this.props.history.push(`?${queryString.stringify(host)}`)
  }

  render () {
    // TODO: support to use current domain
    const {
      openDialog, closeDialog, open, error, validPattern, pattern
    } = this.props.NewPatternStore
    return (
      <span>
        <Button color='primary' onClick={openDialog}>New RegExp</Button>
        <Dialog
          open={open}
          onClose={closeDialog}
        >
          <DialogTitle>New RegExp Pattern</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To use regular expression match websites, please enter a valid regular expression here.
              You can use <a href='https://regex101.com/' target='_blank' rel='noopener noreferrer'>
                Regex101
              </a> to validate your regular expression.
            </DialogContentText>
            <FormControl
              fullWidth
              error={!validPattern}>
              <TextField
                autoFocus
                error={!validPattern}
                margin='dense'
                label='RegExp Pattern'
                placeholder='.*github.com'
                type='text'
                value={pattern}
                onChange={this.onChange}
              />
              <FormHelperText>{error}</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              color='primary'
              onClick={this.onAdd}
              disabled={!validPattern}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </span>
    )
  }
}
