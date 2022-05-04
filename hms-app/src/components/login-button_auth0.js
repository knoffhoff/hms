import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const LoginButton_auth0 = () => {
  const { loginWithRedirect } = useAuth0()
  return <button onClick={() => loginWithRedirect()}>Auth0 Log In</button>
}

export default LoginButton_auth0
