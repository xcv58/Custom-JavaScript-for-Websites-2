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
import { withRouter } from 'react-router'
import queryString from 'query-string'

const Content = () => (
  <DialogContentText>
    To use regular expression match websites, please enter a valid regular expression here.
    You can use <a href='https://regex101.com/' target='_blank' rel='noopener noreferrer'>
      Regex101
    </a> to validate your regular expression.
  </DialogContentText>
)

@withRouter
@inject('NewPatternStore')
@observer
class NewPatternDialog extends Component {
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
    const { closeDialog, error, validPattern, pattern } = this.props.NewPatternStore
    return (
      <Dialog open onClose={closeDialog}>
        <DialogTitle>New RegExp Pattern</DialogTitle>
        <DialogContent>
          <Content />
          <FormControl fullWidth error={!validPattern}>
            <TextField autoFocus margin='dense' type='text'
              placeholder='.*github.com'
              label='RegExp Pattern'
              error={!validPattern}
              value={pattern}
              onChange={this.onChange} />
            <FormHelperText>{error}</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button color='primary' onClick={this.onAdd} disabled={!validPattern}>Add</Button>
        </DialogActions>
      </Dialog>
    )
  }
}

@inject('NewPatternStore')
@observer
export default class NewPattern extends Component {
  render () {
    // TODO: support to use current domain
    const { openDialog, open } = this.props.NewPatternStore
    return (
      <span>
        <Button color='primary' onClick={openDialog}>New RegExp</Button>
        {open && <NewPatternDialog />}
      </span>
    )
  }
}
