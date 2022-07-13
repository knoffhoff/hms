import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'

const core_url = process.env.REACT_APP_CORE_URL

export const deleteParticipant = async (
  instance: IPublicClientApplication,
  participantID: string
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/participant/${participantID}`, {
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

export const createHackathonParticipant = async (
  instance: IPublicClientApplication,
  userId: string,
  hackathonId: string
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/participant`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      userId: userId,
      hackathonId: hackathonId,
    }),
  })
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
  return fetch(`${core_url}/idea/${idea_id}/join/${participant_id}`, {
    method: 'PUT',
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

export const removeIdeaParticipant = async (
  instance: IPublicClientApplication,
  idea_id: string,
  participant_id: string
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/idea/${idea_id}/leave/${participant_id}`, {
    method: 'PUT',
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

export const getParticipantDetails = async (
  instance: IPublicClientApplication,
  participantID: string
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/category/${participantID}`, {
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
