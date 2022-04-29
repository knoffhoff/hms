import React from 'react'
import { Accordion } from '@mantine/core'
import NewHackathon from '../components/NewHackathon'
import NewAllHackathonList from '../components/NewAllHackathonList'

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

      <Accordion mb={30} onChange={() => console.log('click')}>
        <Accordion.Item
          style={{ border: '1px solid' }}
          label={'New Hackathon list'}
        >
          <NewAllHackathonList />
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default AdminPage
