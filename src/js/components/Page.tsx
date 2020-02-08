import React, { useEffect } from 'react'
import AutoSave from 'components/AutoSave'
import Loading from 'components/Loading'
import Editor from 'components/Editor'
import Error from 'components/Error'
import LoadError from 'components/LoadError'
import RemoveDraft from 'components/RemoveDraft'
import Goto from 'components/Goto'
import Hosts from 'components/Hosts'
import DonateLink from 'components/DonateLink'
import Toggle from 'components/Toggle'
import Include from 'components/Include'
import Reset from 'components/Reset'
import ModeSelect from 'components/ModeSelect'
import Save from 'components/Save'
import Size from 'components/Size'
import NewPattern from 'components/NewPattern'
import queryString from 'query-string'
import NewTabLink from './NewTabLink'
import { useStore } from './StoreContext'
import { observer } from 'mobx-react'
import Format from './Format'
import HostTableLink from './HostTableLink'

const toolbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

export default observer(props => {
  const { AppStore } = useStore()
  const { location } = props
  useEffect(() => {
    const { location } = props
    const query = queryString.parse(location.search)
    AppStore.init(query)
  }, [location.search])

  const { loading, error, loadError } = AppStore

  const closePopup = () => {
    if (!AppStore.tabMode) {
      window.close()
    }
  }

  if (loadError) {
    return <LoadError error={loadError} />
  }
  if (error) {
    return <Error error={error} />
  }
  if (loading) {
    return <Loading />
  }
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr auto',
        height: '100vh'
      }}
    >
      <div style={toolbarStyle}>
        <div>
          <Save onSave={() => AppStore.save()} />
          <Reset closePopup={closePopup} />
          <ModeSelect />
          <Format />
          <NewTabLink />
          <HostTableLink />
        </div>
        <div>
          <Toggle />
        </div>
      </div>
      <div style={toolbarStyle}>
        <div>
          <Hosts />
          <NewPattern />
          <Goto
            goTo={() => {
              AppStore.goTo()
              closePopup()
            }}
          />
        </div>
        <Include />
      </div>
      <Editor />
      <div style={toolbarStyle}>
        <span>
          <RemoveDraft />
          <AutoSave />
        </span>
        <Size />
        <DonateLink />
      </div>
      <div id='error' className='error is-hidden'>
        <strong>Custom JavaScript says:</strong>
        <p className='red-text'>
          It seems that this page cannot be modified with me..
        </p>
        <span>tip: Try refresh page</span>
      </div>
    </div>
  )
})
