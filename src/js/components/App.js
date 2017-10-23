import React from 'react'
import Page from './Page'
import { BrowserRouter, Route } from 'react-router-dom'

export default () => (
  <BrowserRouter>
    <Route path='/' component={Page} />
  </BrowserRouter>
)
