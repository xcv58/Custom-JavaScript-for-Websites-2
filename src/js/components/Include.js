import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('IncludeStore')
@observer
export default class Include extends Component {
  onSelect = (e) => {
    e.preventDefault()
    this.props.IncludeStore.onSelect(e.target.value)
  }

  onUpdateExtra = (e) => {
    this.props.IncludeStore.onUpdateExtra(e.target.value)
  }

  render () {
    const { include, includes, extraOpen, toggleExtraOpen, extraValue } = this.props.IncludeStore
    return (
      <div className='pure-u-5-6 include'>
        <div className='include__body'>
          You can inject <a href='#' onClick={toggleExtraOpen}>your own external scripts</a> or
          <label htmlFor='include'> predefined one:</label>
          <select
            name='include'
            value={include}
            onChange={this.onSelect}
          >
            <option value=''> ---- nothing ---- </option>
            {
              includes.map(({ name, path }) => (
                <option key={name} value={path}>
                  {name}
                </option>
              ))
            }
          </select>
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
