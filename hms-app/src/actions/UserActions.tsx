import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'
import { buildFetchOptions } from '../common/actionOptions'

const core_url = process.env.REACT_APP_CORE_URL

export const getListOfUsers = async (instance: IPublicClientApplication) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${core_url}/users`, options)
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
  return fetch(`${core_url}/user/${userID}`, options)
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
  return fetch(`${core_url}/hackathon/${userID}`, options)
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
  return fetch(`${core_url}/user/${user.id}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
