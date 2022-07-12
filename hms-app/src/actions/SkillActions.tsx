import { IPublicClientApplication } from '@azure/msal-browser'
import { getIdToken } from '../common/actionAuth'

const core_url = process.env.REACT_APP_CORE_URL

export const getListOfSkills = async (instance: IPublicClientApplication) => {
  const idToken = await getIdToken(instance)
  return fetch(`${core_url}/skills`, {
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
