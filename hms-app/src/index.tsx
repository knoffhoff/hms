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

// MSAL configuration
const configuration: Configuration = {
  auth: {
    clientId: 'c3204340-bdc2-4e36-87b9-e7cfc09034fd',
    authority:
      'https://login.microsoftonline.com/21956b19-fed2-44b7-90cf-b6d281c0a42a',
    redirectUri: 'http://localhost:3001',
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
