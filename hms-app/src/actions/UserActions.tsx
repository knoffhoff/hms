const core_url = process.env.REACT_APP_CORE_URL

export const getListOfUsers = () => {
  return fetch(`${core_url}/users`, {
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

export const getUserDetails = (userID: string) => {
  return fetch(`${core_url}/user/${userID}`, {
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

export const deleteUser = (userID: string) => {
  return fetch(`${core_url}/hackathon/${userID}`, {
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

export const editUser = (
  contextID: string,
  user: {
    lastName: string
    firstName: string
    emailAddress: string
    roles: any[]
    imageUrl: string
  },
  skills: string[]
) => {
  return fetch(`${core_url}/user/${contextID}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      skills: skills,
      lastName: user.lastName,
      firstName: user.firstName,
      emailAddress: user.emailAddress,
      roles: user.roles,
      imageUrl: user.imageUrl,
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
