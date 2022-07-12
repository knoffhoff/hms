import {
  InteractionRequiredAuthError,
  IPublicClientApplication,
} from '@azure/msal-browser'
import { AuthenticationResult } from '@azure/msal-common'

const USE_AZURE_AUTH = process.env.REACT_APP_USE_AZURE_AUTH === 'true'

const getTokens = async (instance: IPublicClientApplication) => {
  const request = {
    scopes: ['profile User.Read email'],
  }
  const accounts = instance.getAllAccounts()

  if (accounts.length > 0) instance.setActiveAccount(accounts[0])
  let tokenResponse: AuthenticationResult = {} as AuthenticationResult
  try {
    tokenResponse = await instance.acquireTokenSilent(request)
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      await instance.acquireTokenRedirect(request)
    }
  }
  return tokenResponse
}

export const getIdToken = async (instance: IPublicClientApplication) => {
  if (USE_AZURE_AUTH) {
    const tokenResponse = await getTokens(instance)
    return tokenResponse.idToken
  } else {
    return ''
  }
}

export const getAccessToken = async (instance: IPublicClientApplication) => {
  if (USE_AZURE_AUTH) {
    const tokenResponse = await getTokens(instance)
    return tokenResponse.accessToken
  } else {
    return ''
  }
}

export const getProfile = async (instance: IPublicClientApplication) => {
  const headers = new Headers()
  const accessToken = await getAccessToken(instance)
  headers.append('Authorization', `Bearer ${accessToken}`)
  const options = {
    method: 'GET',
    headers: headers,
  }

  const response = await fetch('https://graph.microsoft.com/v1.0/me', options)
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return await response.json()
}

export const getProfilePhoto = async (instance: IPublicClientApplication) => {
  const headers = new Headers()
  const accessToken = await getAccessToken(instance)
  headers.append('Authorization', `Bearer ${accessToken}`)
  const options = {
    method: 'GET',
    headers: headers,
  }

  const response = await fetch(
    'https://graph.microsoft.com/v1.0/me/photo/$value',
    options
  )
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return await response.blob()
}
