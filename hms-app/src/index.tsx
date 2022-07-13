import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { NotificationsProvider } from '@mantine/notifications'
import { Provider } from 'react-redux'
import { store } from './store'
import { MsalProvider } from '@azure/msal-react'
import { Configuration, PublicClientApplication } from '@azure/msal-browser'

const AZURE_CLIENT_ID = process.env.REACT_APP_AZURE_CLIENT_ID || ''
const AZURE_AUTHORITY = process.env.REACT_APP_AZURE_AUTHORITY || ''
const REDIRECT_URI = process.env.REACT_APP_AZURE_REDIRECT_URL || ''
const configuration: Configuration = {
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: AZURE_AUTHORITY,
    redirectUri: REDIRECT_URI,
  },
}

const pca = new PublicClientApplication(configuration)

ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={pca}>
      <BrowserRouter>
        <Provider store={store}>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </Provider>
      </BrowserRouter>
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
