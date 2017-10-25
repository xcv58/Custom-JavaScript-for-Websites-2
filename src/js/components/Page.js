import React, { Component } from 'react'
import AutoSave from 'components/AutoSave'
import Editor from 'components/Editor'
import RemoveDraft from 'components/RemoveDraft'
import Goto from 'components/Goto'
import DonateLink from 'components/DonateLink'
import Toggle from 'components/Toggle'
import Include from 'components/Include'
import Reset from 'components/Reset'
import Save from 'components/Save'
import queryString from 'query-string'
import NewTabLink from './NewTabLink'
import { inject, observer } from 'mobx-react'

const toolbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

@inject('AppStore')
@observer
export default class Page extends Component {
  onReset = (e) => {
    e.preventDefault()
    this.props.AppStore.reset()
  }

  onSave = () => {
    this.props.AppStore.save()
    this.closePopup()
  }

  onSelectHost = (e) => {
    e.preventDefault()
    const newHost = e.target.value
    this.props.history.push(`?domain=${newHost}`)
  }

  goTo = () => {
    this.props.AppStore.goTo()
    this.closePopup()
  }

  closePopup = () => {
    if (!this.props.AppStore.tabMode) {
      window.close()
    }
  }

  init = () => {
    const { location } = this.props
    const { domain } = queryString.parse(location.search)
    this.props.AppStore.init(domain)
  }

  componentDidUpdate (prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.init()
    }
  }

  componentDidMount = this.init

  render () {
    const { hosts, domain } = this.props.AppStore
    return (
      <div className='customjs'>
        <div style={toolbarStyle}>
          <div>
            <select onChange={this.onSelectHost} value={domain}>
              {
                hosts.map((host, i) => (
                  <option key={host} value={host}>{host}</option>
                ))
              }
            </select>
            <Goto goTo={this.goTo} />
          </div>
          <div>
            <Toggle />
          </div>
        </div>
        <div className='pure-g'>
          <AutoSave />
          <Include />
        </div>
        <div className='pure-g'>
          <div className='pure-u-1'>
            <Editor />
          </div>
        </div>
        <div style={toolbarStyle}>
          <div>
            <Save onSave={this.onSave} />
            <Reset />
            <NewTabLink />
            <RemoveDraft />
          </div>
          <div>
            <DonateLink />
          </div>
        </div>
        <div id='error' className='error is-hidden'>
          <strong>Custom JavaScript says:</strong>
          <p className='red-text'>It seems that this page cannot be modified with me..</p>
          <span>tip: Try refresh page</span>
        </div>
      </div>
    )
  }
}
