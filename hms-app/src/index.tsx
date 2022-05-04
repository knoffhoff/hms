import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { NotificationsProvider } from '@mantine/notifications'
import AuthProvider from './auth/auth_provider'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './azureAuthConfig'

const msalInstance = new PublicClientApplication(msalConfig)

// Azure Variant
// to use the Auth0 variant go to hms-app/src/pages/Layout.tsx and change the end of the file
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationsProvider>
        <MsalProvider instance={msalInstance}>
          <App />
        </MsalProvider>
      </NotificationsProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// Auth0 Variant
// to use the Auth0 variant go to hms-app/src/pages/Layout.tsx and change the end of the file
/*ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationsProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </NotificationsProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
