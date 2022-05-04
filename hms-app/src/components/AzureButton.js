import React from 'react'
import { useIsAuthenticated } from '@azure/msal-react'
import { SignInButton } from './login-button_azure'

/**
 * Renders the navbar component with a sign-in button if a user is not authenticated
 */
export const AzureButton = () => {
  const isAuthenticated = useIsAuthenticated()

  return <>{isAuthenticated ? <span>Signed In</span> : <SignInButton />}</>
}
