import React from 'react'
import { Accordion } from '@mantine/core'
import NewHackathon from '../components/admin-tools/NewHackathon'
import AllHackathonList from '../components/AllHackathonList'
import AllUserList from '../components/admin-tools/AllUserList'

function AdminPage() {
  return (
    <>
      <h1>Hello Admin </h1>
      <h2>Nice to see you</h2>

      <Accordion mb={30}>
        <Accordion.Item
          style={{ border: '1px solid' }}
          label={'Create new hackathon'}
        >
          <NewHackathon />
        </Accordion.Item>
      </Accordion>

      <Accordion mb={30}>
        <Accordion.Item
          style={{ border: '1px solid' }}
          label={'Hackathon list'}
        >
          <AllHackathonList />
        </Accordion.Item>
      </Accordion>

      <Accordion mb={30}>
        <Accordion.Item style={{ border: '1px solid' }} label={'User list'}>
          <AllUserList />
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default AdminPage
