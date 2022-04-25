import { Idea } from '../common/types'
import { ApiVariable } from './ApiVariable'

const api_id = 'w3xa9nfaxn'

export const getIdeaDetails = (ideaID: string): Promise<Idea> => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/idea/${ideaID}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}
