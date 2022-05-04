import React from 'react'

import LoginButton_auth0 from './login-button_auth0'
import LogoutButton_auth0 from './logout-button_auth0'

import { useAuth0 } from '@auth0/auth0-react'

const Auth0Button = () => {
  const { isAuthenticated } = useAuth0()

  return (
    <div>
      {isAuthenticated ? <LogoutButton_auth0 /> : <LoginButton_auth0 />}
    </div>
  )
}

export default Auth0Button
