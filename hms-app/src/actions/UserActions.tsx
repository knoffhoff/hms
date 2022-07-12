import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'

const core_url = process.env.REACT_APP_CORE_URL

export const getListOfUsers = async (instance: IPublicClientApplication) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/users`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
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
  return fetch(`${core_url}/user/${userID}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
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
  return fetch(`${core_url}/hackathon/${userID}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
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
  return fetch(`${core_url}/user/${user.id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      skills: skills,
      lastName: user.lastName,
      firstName: user.firstName,
      emailAddress: user.emailAddress,
      roles: user.roles,
      imageUrl: user.imageUrl,
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
