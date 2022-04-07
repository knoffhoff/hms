export const getListOfHackathons = (endpoint: any) => {
  return fetch(
    `${'http://localhost:4566/restapis/7s7hkibztq/local/_user_request_'}/${endpoint}`,
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

export const getHackathonDetails = (endpoint: any) => {
  return fetch(
    `${'http://localhost:4566/restapis/7s7hkibztq/local/_user_request_/hackathon'}/${endpoint}`,
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
