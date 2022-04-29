const core_url = process.env.REACT_APP_CORE_URL

export const getListOfSkills = () => {
  return fetch(`${core_url}/skills`, {
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
