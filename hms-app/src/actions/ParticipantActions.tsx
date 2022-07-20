import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'
import { buildFetchOptions } from '../common/actionOptions'

const core_url = process.env.REACT_APP_CORE_URL

export const deleteParticipant = async (
  instance: IPublicClientApplication,
  participantID: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('DELETE', idToken)
  return fetch(`${core_url}/participant/${participantID}`, options)
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
  return fetch(`${core_url}/participant`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const createIdeaParticipant = async (
  instance: IPublicClientApplication,
  idea_id: string,
  participant_id: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('PUT', idToken)
  return fetch(`${core_url}/idea/${idea_id}/join/${participant_id}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const removeIdeaParticipant = async (
  instance: IPublicClientApplication,
  idea_id: string,
  participant_id: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('PUT', idToken)
  return fetch(`${core_url}/idea/${idea_id}/leave/${participant_id}`, options)
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
  return fetch(`${core_url}/category/${participantID}`, options)
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}
