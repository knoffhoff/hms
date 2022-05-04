import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const LogoutButton_auth0 = () => {
  const { logout } = useAuth0()
  return (
    <button
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }
    >
      Log Out
    </button>
  )
}

export default LogoutButton_auth0
