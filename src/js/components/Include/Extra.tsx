import React from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useStore } from 'components/StoreContext'
import { observer } from 'mobx-react'

export default observer(() => {
  const { IncludeStore } = useStore()
  const { extraOpen, extraValue, placeholder, toggleExtraOpen } = IncludeStore
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
          onChange={(e) => IncludeStore.onUpdateExtra(e.target.value)}
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
})
