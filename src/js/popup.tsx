import 'chrome-extension-async'
import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { render } from 'react-dom'
import App from 'components/App'
import { StoreContext, store } from 'components/StoreContext'
import '../css/style.css'

const theme = createMuiTheme({
  typography: {
    button: {
      textTransform: 'none'
    }
  }
})

const initApp = () => {
  render(
    <StoreContext.Provider value={store}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </StoreContext.Provider>,
    document.getElementById('app')
  )
}

initApp()
