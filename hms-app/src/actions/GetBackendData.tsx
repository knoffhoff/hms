import { Idea } from '../common/types'

const apiId = process.env.API_ID

export const getListOfHackathons = () => {
  return fetch(
    `http://localhost:4566/restapis/${apiId}/local/_user_request_/hackathons`,
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

export const getHackathonDetails = (hackathonID: string) => {
  return fetch(
    `http://localhost:4566/restapis/${apiId}/local/_user_request_/hackathon/${hackathonID}`,
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

export const getIdeaDetails = (ideaID: string): Promise<Idea> => {
  return fetch(
    `http://localhost:4566/restapis/${apiId}/local/_user_request_/idea/${ideaID}`,
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
