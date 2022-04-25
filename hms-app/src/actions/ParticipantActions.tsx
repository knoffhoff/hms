const api_id = 'w3xa9nfaxn'

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

export const createHackathonParticipant = (props: {
  userId: string
  hackathonId: string
}) => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/participant`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: props.userId,
        hackathonId: props.hackathonId,
      }),
    }
  )
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
