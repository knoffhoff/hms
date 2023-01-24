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
  return fetch(`${coreUrl}/idea/${ideaID}/comments`, options)
    .then((data) => data.json())
    .catch((err) => console.log(err))
}

export const createIdeaComment = async (
  instance: IPublicClientApplication,
  ideaID: string,
  commentText: string,
  userId: string,
  replyTo?: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('POST', idToken, {
    ideaId: ideaID,
    userId: userId,
    text: commentText,
    replyTo: replyTo ? replyTo : '',
  })
  return fetch(`${coreUrl}/idea/${ideaID}/comment`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const editIdeaComment = async (
  instance: IPublicClientApplication,
  id: string,
  commentText: string
) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('PUT', idToken, {
    text: commentText,
  })
  return fetch(`${coreUrl}/idea/comment/${id}`, options)
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
  return fetch(`${coreUrl}/idea/comment/${id}`, options)
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
