import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'
import { buildFetchOptions } from '../common/actionOptions'

const core_url = process.env.REACT_APP_CORE_URL

export const getListOfSkills = async (instance: IPublicClientApplication) => {
  const idToken = await getIdToken(instance)
  const options = buildFetchOptions('GET', idToken)
  return fetch(`${core_url}/skills`, options)
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}
