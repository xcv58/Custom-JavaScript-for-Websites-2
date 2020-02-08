import React from 'react'
import Page from './Page'
import { HashRouter, Route } from 'react-router-dom'
import HostTable from './HostTable'

export default () => (
  <HashRouter>
    <Route path='/list' component={HostTable} />
    <Route path='/' exact component={Page} />
  </HashRouter>
)
