import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { InputLabel } from 'material-ui/Input'
import { MenuItem } from 'material-ui/Menu'
import { FormControl } from 'material-ui/Form'
import Button from 'material-ui/Button'
import Select from 'material-ui/Select'

@inject('IncludeStore')
@observer
export default class Include extends Component {
  onSelect = (e) => {
    this.props.IncludeStore.onSelect(e.target.value)
  }

  onUpdateExtra = (e) => {
    this.props.IncludeStore.onUpdateExtra(e.target.value)
  }

  render () {
    const { include, includes, extraOpen, toggleExtraOpen, extraValue } = this.props.IncludeStore
    const options = includes.map(({ name, path }) => (
      <MenuItem key={name} value={path}>{name}</MenuItem>
    ))
    return (
      <div>
        <div>
          <InputLabel>You can inject </InputLabel>
          <Button color='primary'
            onClick={toggleExtraOpen}
            style={{ padding: 0 }}>
            your own external scripts
          </Button>
          <InputLabel> or predefined one: </InputLabel>
          <FormControl>
            <Select value={include}
              displayEmpty
              autoWidth
              onChange={this.onSelect}>
              <MenuItem value=''>
                <em>None</em>
              </MenuItem>
              {options}
            </Select>
          </FormControl>
        </div>
        <div className={`include__popbox ${extraOpen ? '' : 'is-hidden'}`}>
          <div className='include__popbox__body'>
            <textarea name='extra-scripts' value={extraValue} onChange={this.onUpdateExtra} />
          </div>
          <div className='include__popbox__screenmask' onClick={toggleExtraOpen} />
        </div>
      </div>
    )
  }
}
