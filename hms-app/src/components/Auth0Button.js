import React from 'react'

import LoginButton_auth0 from './login-button_auth0'
import LogoutButton from './logout-button'

import { useAuth0 } from '@auth0/auth0-react'

const Auth0Button = () => {
  const { isAuthenticated } = useAuth0()

  return <div>{isAuthenticated ? <LogoutButton /> : <LoginButton_auth0 />}</div>
}

export default Auth0Button
