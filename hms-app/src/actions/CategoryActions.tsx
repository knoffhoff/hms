import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'

const core_url = process.env.REACT_APP_CORE_URL

export const addCategory = async (
  instance: IPublicClientApplication,
  props: {
    hackathonID: string
    title: string
    description: string
  }
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/category`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      title: props.title,
      description: props.description,
      hackathonId: props.hackathonID,
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const deleteCategory = async (
  instance: IPublicClientApplication,
  categoryID: string
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/category/${categoryID}`, {
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

export const getListOfCategories = async (
  instance: IPublicClientApplication,
  hackathonID: string
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/hackathon/${hackathonID}/categories`, {
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

export const getCategoryDetails = async (
  instance: IPublicClientApplication,
  categoryID: string
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/category/${categoryID}`, {
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

export const editCategory = async (
  instance: IPublicClientApplication,
  props: {
    categoryID: string
    title: string
    description: string
  }
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/category/${props.categoryID}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      title: props.title,
      description: props.description,
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
