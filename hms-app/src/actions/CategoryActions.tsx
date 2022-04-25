import { ApiVariable } from './ApiVariable'

const api_id = 'w3xa9nfaxn'

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

export const deleteCategory = (categoryID: string) => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/category/${categoryID}`,
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
