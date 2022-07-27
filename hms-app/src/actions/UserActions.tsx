import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'
import { buildFetchOptions } from '../common/actionOptions'
import { ActiveDirectoryUser } from '../common/types'

const coreUrl = process.env.REACT_APP_CORE_URL

export const getListOfUsers = async (instance: IPublicClientApplication) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${coreUrl}/users`, options)
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}

export const getUserDetails = async (
  instance: IPublicClientApplication,
  userID: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${coreUrl}/user/${userID}`, options)
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}

export const deleteUser = async (
  instance: IPublicClientApplication,
  userID: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('DELETE', idToken)
  return fetch(`${coreUrl}/hackathon/${userID}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const editUser = async (
  instance: IPublicClientApplication,
  user: {
    id: string
    lastName: string
    firstName: string
    emailAddress: string
    roles: any[]
    imageUrl: string
  },
  skills: string[]
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('PUT', idToken, {
    skills,
    lastName: user.lastName,
    firstName: user.firstName,
    emailAddress: user.emailAddress,
    roles: user.roles,
    imageUrl: user.imageUrl,
  })
  return fetch(`${coreUrl}/user/${user.id}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getUserExists = async (
  instance: IPublicClientApplication,
  user: ActiveDirectoryUser
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${coreUrl}/user/exists/${user.mail}`, options)
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}
