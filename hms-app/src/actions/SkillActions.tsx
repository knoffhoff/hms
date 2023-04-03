import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'
import { buildFetchOptions } from '../common/actionOptions'

const coreUrl = process.env.REACT_APP_CORE_URL

export const addSkill = async (
  instance: IPublicClientApplication,
  props: {
    name: string
    description: string
  }
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('POST', idToken, props)

  return fetch(`${coreUrl}/skill`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.error(err))
}

export const getListOfSkills = async (instance: IPublicClientApplication) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${coreUrl}/skills`, options)
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}

export const getSkillDetails = async (
  instance: IPublicClientApplication,
  skillId: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)

  return fetch(`${coreUrl}/skill/${skillId}`, options)
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}

export const editSkill = async (
  instance: IPublicClientApplication,
  props: {
    id: string
    name: string
    description: string
  }
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('PUT', idToken, {
    name: props.name,
    description: props.description,
  })

  return fetch(`${coreUrl}/skill/${props.id}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const removeSkill = async (
  instance: IPublicClientApplication,
  skillId: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('DELETE', idToken)

  return fetch(`${coreUrl}/skill/${skillId}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
