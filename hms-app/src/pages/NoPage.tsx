import React from 'react'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import Loading from '../components/Loading'

function NoPage() {
  return <h1>this is just a 404 page for every other route</h1>
}

export default withAuthenticationRequired(NoPage, {
  onRedirecting: () => <Loading />,
})
