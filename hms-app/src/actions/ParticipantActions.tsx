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
