import React, { Component } from 'react'
import AutoSave from 'components/AutoSave'
import Loading from 'components/Loading'
import Editor from 'components/Editor'
import RemoveDraft from 'components/RemoveDraft'
import Goto from 'components/Goto'
import Hosts from 'components/Hosts'
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
    const { loading } = this.props.AppStore
    if (loading) {
      return (<Loading />)
    }
    return (
      <div style={{
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr auto',
        height: '100vh'
      }}>
        <div style={toolbarStyle}>
          <div>
            <Hosts {...this.props} />
            <Goto goTo={this.goTo} />
          </div>
          <div>
            <Toggle />
          </div>
        </div>
        <div style={toolbarStyle}>
          <AutoSave />
          <Include />
        </div>
        <Editor />
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
