const api_id = process.env.REACT_APP_API_ID

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
