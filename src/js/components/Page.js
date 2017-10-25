import React, { Component } from 'react'
import AutoSave from 'components/AutoSave'
import Editor from 'components/Editor'
import Include from 'components/Include'
import Reset from 'components/Reset'
import queryString from 'query-string'
import NewTabLink from './NewTabLink'
import { inject, observer } from 'mobx-react'

@inject('AppStore')
@observer
export default class Page extends Component {
  onReset = (e) => {
    e.preventDefault()
    this.props.AppStore.reset()
  }

  onRemoveDraft = (e) => {
    e.preventDefault()
    this.props.AppStore.onRemoveDraft()
  }

  onSave = (e) => {
    e.preventDefault()
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
    const {
      draft, hosts, domain, toggleEnable, enable, differentURL, tabMode
    } = this.props.AppStore
    return (
      <div className='customjs' id='customjs'>
        <form action='' method='post' acceptCharset='utf-8' id='popup-form' className='pure-form'>
          <div className='pure-g host'>
            <div className='pure-u-3-5 host__name'>
              <select onChange={this.onSelectHost} value={domain}>
                {
                  hosts.map((host, i) => (
                    <option key={host} value={host}>{host}</option>
                  ))
                }
              </select>
              {differentURL && <a href='#' onClick={this.goTo}>go to</a>}
            </div>
            <div className='pure-u-2-5 host__enable'>
              <label htmlFor='enable'>
                enable <em className='blue-text'>cjs</em> for this host
                <input type='checkbox' checked={enable} onClick={toggleEnable} />
              </label>
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
          <div className='pure-g'>
            <div className='pure-u-4-5 controls'>
              <input
                type='submit'
                className='controls__save pure-button pure-button-primary'
                value='save'
                disabled={differentURL && !tabMode}
                onClick={this.onSave}
              />
              <Reset />
              <NewTabLink />
              {
                draft &&
                <button className='controls__remove-draft red-text pure-button' onClick={this.onRemoveDraft}>
                  remove draft
                </button>
              }
            </div>
            <div className='pure-u-1-5 donate'>
              <a className='donate__button pure-button' href='https://paypal.me/xcv58' target='_blank'>donate</a>
            </div>
          </div>
        </form>
        <div id='error' className='error is-hidden'>
          <strong>Custom JavaScript says:</strong>
          <p className='red-text'>It seems that this page cannot be modified with me..</p>
          <span>tip: Try refresh page</span>
        </div>
      </div>
    )
  }
}
