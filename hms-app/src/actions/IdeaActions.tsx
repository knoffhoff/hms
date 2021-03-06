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
  return fetch(`${coreUrl}/hackathon/${hackathonID}/ideas`, options)
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
  const options = buildFetchOptions('PUT', idToken, {
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
