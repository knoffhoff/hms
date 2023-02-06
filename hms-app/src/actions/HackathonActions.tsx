import {
  Hackathon,
  HackathonPreview,
  parseHackathon,
  parseHackathonPreviews,
} from '../common/types'
import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'
import { buildFetchOptions } from '../common/actionOptions'

const coreUrl = process.env.REACT_APP_CORE_URL

export const getListOfHackathons = async (
  instance: IPublicClientApplication
): Promise<HackathonPreview[]> => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${coreUrl}/hackathons`, options)
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
  return fetch(`${coreUrl}/hackathon/${hackathonID}`, options)
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
  slug: string,
  startDate: Date,
  endDate: Date
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('POST', idToken, {
    title,
    description: DescriptionValue,
    slug,
    startDate: startDate.toString(),
    endDate: endDate.toString(),
  })
  return fetch(`${coreUrl}/hackathon`, options)
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
  slug: string,
  startDate: Date,
  endDate: Date,
  votingOpened: boolean
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('PUT', idToken, {
    title,
    description: DescriptionValue,
    slug,
    startDate: startDate.toString(),
    endDate: endDate.toString(),
    votingOpened: votingOpened.toString(), // votingOpened.toString() also doesnt work,
  })
  return fetch(`${coreUrl}/hackathon/${hackathonID}`, options)
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
  return fetch(`${coreUrl}/hackathon/${hackathonID}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
