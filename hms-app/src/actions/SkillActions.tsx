const api_id = 'l6edxqb897'

export const getListOfSkills = () => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/skills`,
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
