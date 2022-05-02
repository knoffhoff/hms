const core_url = process.env.REACT_APP_CORE_URL

export const addCategory = (props: {
  contextID: string
  title: string
  description: string
}) => {
  return fetch(`${core_url}/category`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: props.title,
      description: props.description,
      hackathonId: props.contextID,
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const deleteCategory = (categoryID: string) => {
  return fetch(`${core_url}/category/${categoryID}`, {
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

export const getListOfCategories = (hackathonID: string) => {
  return fetch(`${core_url}/hackathon/${hackathonID}/categories`, {
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

export const getCategoryDetails = (categoryID: string) => {
  return fetch(`${core_url}/category/${categoryID}`, {
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

export const editCategory = (props: {
  contextID: string
  title: string
  description: string
}) => {
  return fetch(`${core_url}/category/${props.contextID}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: props.title,
      description: props.description,
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
