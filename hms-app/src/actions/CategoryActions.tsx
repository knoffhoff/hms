import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'
import CategoryDetails from '../components/card-details/CategoryDetails'
import { buildFetchOptions } from '../common/actionOptions'

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
  const options = buildFetchOptions('POST', idToken, {
    title: props.title,
    description: props.description,
    hackathonId: props.hackathonID,
  })
  return fetch(`${core_url}/category`, options)
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
  const options = buildFetchOptions('DELETE', idToken)
  return fetch(`${core_url}/category/${categoryID}`, options)
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
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${core_url}/hackathon/${hackathonID}/categories`, options)
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
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${core_url}/category/${categoryID}`, options)
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
  const options = buildFetchOptions('PUT', idToken, {
    title: props.title,
    description: props.description,
  })
  return fetch(`${core_url}/category/${props.categoryID}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
