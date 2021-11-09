import React from 'react'
import Page from './Page'
import { HashRouter, Route, Routes } from 'react-router-dom'
import HostTable from './HostTable'

export default () => (
  <HashRouter>
    <Routes>
      <Route path='/list' element={<HostTable />} />
      <Route path='/' element={<Page />} />
    </Routes>
  </HashRouter>
)
