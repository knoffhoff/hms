import { Idea } from '../common/types'

const api_id = '6cyvp5ukhc'

export const getListOfHackathons = () => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/hackathons`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getHackathonDetails = (hackathonID: string) => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/hackathon/${hackathonID}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getIdeaDetails = (ideaID: string) => {
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
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
