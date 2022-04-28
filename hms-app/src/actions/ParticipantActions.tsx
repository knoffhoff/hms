const api_id = process.env.REACT_APP_API_ID

export const deleteParticipant = (participantID: string) => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/participant/${participantID}`,
    {
      method: 'DELETE',
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

export const createParticipant = (userId: string, hackathonId: string) => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/participant`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        hackathonId: hackathonId,
      }),
    }
  )
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getParticipantDetails = (participantID: string) => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/category/${participantID}`,
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
