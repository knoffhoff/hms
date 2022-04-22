import { Idea } from '../common/types'

const api_id = 'pv2cjm7zm3'

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
    .then((data) => {
      return data.json()
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
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}

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

export const createHackathon = (props: {
  endDate: string
  title: string
  startDate: string
}) => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/hackathon`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: props.title,
        startDate: props.startDate,
        endDate: props.endDate,
      }),
    }
  )
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const addCategory = (props: {
  title: string
  description: string
  hackathonID: string
}) => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/category`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: props.title,
        description: props.description,
        hackathonId: props.hackathonID,
      }),
    }
  )
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
