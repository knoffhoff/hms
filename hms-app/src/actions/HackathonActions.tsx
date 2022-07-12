import {
  Hackathon,
  HackathonPreview,
  parseHackathon,
  parseHackathons,
  parseHackathonPreviews,
} from '../common/types'
import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'

const core_url = process.env.REACT_APP_CORE_URL

export const getListOfHackathons = async (
  instance: IPublicClientApplication
): Promise<HackathonPreview[]> => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/hackathons`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
    .then((data) => data.json())
    .then((json) => parseHackathonPreviews(json.hackathons))
    .catch((err) => {
      console.log(err)
      throw err
    })
}

export const getHackathonDetails = async (
  instance: IPublicClientApplication,
  hackathonID: string
): Promise<Hackathon> => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/hackathon/${hackathonID}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
  })
    .then((data) => data.json())
    .then((json) => parseHackathon(json))
    .catch((err) => {
      console.log(err)
      throw err
    })
}

export const createHackathon = async (
  instance: IPublicClientApplication,
  title: string,
  DescriptionValue: string,
  startDate: Date,
  endDate: Date
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/hackathon`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      title: title,
      description: DescriptionValue,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const editHackathon = async (
  instance: IPublicClientApplication,
  hackathonID: string,
  title: string,
  DescriptionValue: string,
  startDate: Date,
  endDate: Date
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/hackathon/${hackathonID}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      title: title,
      description: DescriptionValue,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const deleteHackathon = async (
  instance: IPublicClientApplication,
  hackathonID: string
) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/hackathon/${hackathonID}`, {
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
