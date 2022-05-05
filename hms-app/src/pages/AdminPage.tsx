import React from 'react'
import { Accordion, Button } from '@mantine/core'
import HackathonForm from '../components/input-forms/HackathonForm'
import AllHackathonList from '../components/lists/AllHackathonList'
import AllUserList from '../components/lists/AllUserList'
import { Link } from 'react-router-dom'

function AdminPage() {
  return (
    <>
      <h1>Hello Admin </h1>
      <h2>Nice to see you</h2>

      <Button mb={20} component={Link} to="/presentations">
        Presentations
      </Button>

      <Accordion mb={30}>
        <Accordion.Item
          style={{ border: '1px solid' }}
          label={'Create new hackathon'}
        >
          <HackathonForm hackathonID={null} context={'new'} />
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
