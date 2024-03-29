import { Idea } from '../common/types'
import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'
import { buildFetchOptions } from '../common/actionOptions'

const coreUrl = process.env.REACT_APP_CORE_URL

export const getIdeaList = async (
  instance: IPublicClientApplication,
  hackathonID: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${coreUrl}/ideas/hackathon/${hackathonID}`, options)
    .then((data) => data.json())
    .catch((err) => console.log(err))
}

export const getAllIdeas = async (instance: IPublicClientApplication) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${coreUrl}/ideas`, options)
    .then((data) => data.json())
    .catch((err) => console.log(err))
}

export const getIdeaDetails = async (
  instance: IPublicClientApplication,
  ideaID: string
): Promise<Idea> => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${coreUrl}/idea/${ideaID}`, options)
    .then((data) => data.json())
    .catch((err) => console.log(err))
}

export const deleteIdea = async (
  instance: IPublicClientApplication,
  ideaID: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('DELETE', idToken)
  return fetch(`${coreUrl}/idea/${ideaID}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const createIdea = async (
  instance: IPublicClientApplication,
  idea: {
    ownerId: string
    hackathonId: string
    title: string
    description: string
    problem: string
    goal: string
  },
  skills: string[],
  categories: string[]
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('POST', idToken, {
    ownerId: idea.ownerId,
    hackathonId: idea.hackathonId,
    title: idea.title,
    description: idea.description,
    problem: idea.problem,
    goal: idea.goal,
    requiredSkills: skills,
    categoryId: categories.toString(),
  })
  return fetch(`${coreUrl}/idea`, options)
    .then((data) => data.json())
    .catch((err) => console.log(err))
}

export const editIdea = async (
  instance: IPublicClientApplication,
  ideaID: string,
  idea: {
    hackathonId: string
    title: string
    description: string
    problem: string
    goal: string
  },
  skills: string[],
  categories: string[]
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('PUT', idToken, {
    hackathonId: idea.hackathonId,
    title: idea.title,
    description: idea.description,
    problem: idea.problem,
    goal: idea.goal,
    requiredSkills: skills,
    categoryId: categories.toString(),
  })
  return fetch(`${coreUrl}/idea/${ideaID}`, options)
    .then((data) => data.json())
    .catch((err) => console.log(err))
}

export const getPresignedUrl = async (
  instance: IPublicClientApplication,
  ideaID: string,
  type: 'upload' | 'download'
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  const path = type === 'upload' ? 'upload-url' : 'download-url'
  return fetch(`${coreUrl}/idea/${ideaID}/${path}`, options)
    .then((data) => data.json())
    .catch((err) => console.log(err))
}

export const uploadVideoToS3 = async (
  presignedUrl: string,
  ideaID: string,
  file: string | ArrayBuffer | null
) => {
  const options: RequestInit = {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
    },
    body: file,
  }
  try {
    return await fetch(presignedUrl, options)
  } catch (err) {
    console.log(err)
  }
}

export const checkIfVideoExists = async (videoUrl: string) => {
  const options: RequestInit = {
    method: 'HEAD',
  }
  try {
    return await fetch(videoUrl, options)
  } catch (err) {
    console.log(err)
  }
}
