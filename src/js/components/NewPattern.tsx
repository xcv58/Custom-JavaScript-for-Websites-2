import React from 'react'
import { useHistory } from 'react-router-dom'
import queryString from 'query-string'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'
import {
  DialogContentText,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  TextField,
  FormHelperText,
  DialogActions,
  Button
} from '@material-ui/core'

const Content = () => (
  <DialogContentText>
    To use regular expression match websites, please enter a valid regular
    expression here. You can use{' '}
    <a href='https://regex101.com/' target='_blank' rel='noopener noreferrer'>
      Regex101
    </a>{' '}
    to validate your regular expression.
  </DialogContentText>
)

const NewPatternDialog = observer(() => {
  const history = useHistory()
  const { NewPatternStore } = useStore()
  const { closeDialog, error, validPattern, pattern } = NewPatternStore
  return (
    <Dialog open onClose={closeDialog}>
      <DialogTitle>New RegExp Pattern</DialogTitle>
      <DialogContent>
        <Content />
        <FormControl fullWidth error={!validPattern}>
          <TextField
            autoFocus
            margin='dense'
            type='text'
            placeholder='.*github.com'
            label='RegExp Pattern'
            error={!validPattern}
            value={pattern}
            onChange={e => {
              NewPatternStore.setPattern(e.target.value)
            }}
          />
          <FormHelperText>{error}</FormHelperText>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button
          color='primary'
          onClick={() => {
            const { addToHosts, host } = NewPatternStore
            addToHosts()
            history.push(`?${queryString.stringify(host)}`)
          }}
          disabled={!validPattern}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default observer(() => {
  // TODO: support to use current domain
  const { NewPatternStore } = useStore()
  const { openDialog, open } = NewPatternStore
  return (
    <span>
      <Button color='primary' onClick={openDialog}>
        New RegExp
      </Button>
      {open && <NewPatternDialog />}
    </span>
  )
})
