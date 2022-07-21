import {
  Hackathon,
  HackathonPreview,
  parseHackathon,
  parseHackathons,
  parseHackathonPreviews,
} from '../common/types'
import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'
import { buildFetchOptions } from '../common/actionOptions'

const core_url = process.env.REACT_APP_CORE_URL

export const getListOfHackathons = async (
  instance: IPublicClientApplication
): Promise<HackathonPreview[]> => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${core_url}/hackathons`, options)
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
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${core_url}/hackathon/${hackathonID}`, options)
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
  const options = buildFetchOptions('POST', idToken, {
    title,
    description: DescriptionValue,
    startDate: startDate.toString(),
    endDate: endDate.toString(),
  })
  return fetch(`${core_url}/hackathon`, options)
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
  const options = buildFetchOptions('PUT', idToken, {
    title,
    description: DescriptionValue,
    startDate: startDate.toString(),
    endDate: endDate.toString(),
  })
  return fetch(`${core_url}/hackathon/${hackathonID}`, options)
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
  const options = buildFetchOptions('DELETE', idToken)
  return fetch(`${core_url}/hackathon/${hackathonID}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
