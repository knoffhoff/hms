import React from 'react'

import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import Loading from '../components/Loading'

const Profile = () => {
  const { user, getAccessTokenSilently } = useAuth0()
  const { name, picture, email } = user

  getAccessTokenSilently({
    detailedResponse: true,
    scope: 'fun',
  })
    .then((token) => {
      console.log(token)
    })
    .catch((err) => {
      console.error(JSON.stringify(err))
    })

  return (
    <div>
      <div>
        <div>
          <img src={picture} alt="Profile" />
        </div>
        <div>
          <h2>{name}</h2>
          <p>{email}</p>
        </div>
      </div>
      <div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  )
}

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
})
