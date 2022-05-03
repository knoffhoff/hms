import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { NotificationsProvider } from '@mantine/notifications'
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationsProvider>
        <Auth0ProviderWithHistory>
          <App />
        </Auth0ProviderWithHistory>
      </NotificationsProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
