const core_url = process.env.REACT_APP_CORE_URL

export const deleteParticipant = (participantID: string) => {
  return fetch(`${core_url}/participant/${participantID}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const createParticipant = (userId: string, hackathonId: string) => {
  return fetch(`${core_url}/participant`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: userId,
      hackathonId: hackathonId,
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getParticipantDetails = (participantID: string) => {
  return fetch(`${core_url}/category/${participantID}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}
