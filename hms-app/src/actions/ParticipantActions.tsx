import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'
import { buildFetchOptions } from '../common/actionOptions'

const coreUrl = process.env.REACT_APP_CORE_URL

export const deleteParticipant = async (
  instance: IPublicClientApplication,
  participantID: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('DELETE', idToken)
  return fetch(`${coreUrl}/participant/${participantID}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const createHackathonParticipant = async (
  instance: IPublicClientApplication,
  userId: string,
  hackathonId: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('POST', idToken, {
    userId,
    hackathonId,
  })
  return fetch(`${coreUrl}/participant`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const createIdeaParticipant = async (
  instance: IPublicClientApplication,
  ideaId: string,
  participantId: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('PUT', idToken)
  return fetch(`${coreUrl}/idea/${ideaId}/join/${participantId}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const removeIdeaParticipant = async (
  instance: IPublicClientApplication,
  ideaId: string,
  participantId: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('PUT', idToken)
  return fetch(`${coreUrl}/idea/${ideaId}/leave/${participantId}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getParticipantDetails = async (
  instance: IPublicClientApplication,
  participantID: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${coreUrl}/category/${participantID}`, options)
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}
