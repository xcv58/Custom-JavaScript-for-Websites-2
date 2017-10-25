import 'chrome-extension-async'
import 'typeface-roboto'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import App from 'components/App'
import Store from 'stores'

const store = new Store()

const initApp = () => {
  render(
    <Provider {...store}>
      <App />
    </Provider>,
    document.getElementById('app')
  )
}

initApp()
