import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'
import { buildFetchOptions } from '../common/actionOptions'

const coreUrl = process.env.REACT_APP_CORE_URL

export const getIdeaCommentList = async (
  instance: IPublicClientApplication,
  ideaID: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${coreUrl}/idea/${ideaID}/ideaComments`, options)
    .then((data) => data.json())
    .catch((err) => console.log(err))
}

export const createIdeaComment = async (
  instance: IPublicClientApplication,
  ideaID: string,
  ideaCommentText: string,
  userId: string,
  parentIdeaCommentId?: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('POST', idToken, {
    ideaId: ideaID,
    userId: userId,
    text: ideaCommentText,
    parentIdeaCommentId: parentIdeaCommentId ? parentIdeaCommentId : '',
  })
  return fetch(`${coreUrl}/idea/${ideaID}/ideaComment`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const editIdeaComment = async (
  instance: IPublicClientApplication,
  id: string,
  ideaCommentText: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('PUT', idToken, {
    text: ideaCommentText,
  })
  return fetch(`${coreUrl}/idea/ideaComment/${id}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const deleteIdeaComment = async (
  instance: IPublicClientApplication,
  id: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('DELETE', idToken)
  return fetch(`${coreUrl}/idea/ideaComment/${id}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
