import React from 'react'
import { Accordion, Title } from '@mantine/core'
import HackathonForm from '../components/input-forms/HackathonForm'
import AllHackathonList from '../components/lists/AllHackathonList'
import AllUserList from '../components/lists/AllUserList'
import { styles } from '../common/styles'

function Admin() {
  const { classes } = styles()

  return (
    <>
      <Title order={1} mt={20} mb={50}>
        Administration
      </Title>

      <Accordion className={classes.accordionList}>
        <Accordion.Item
          className={classes.borderAccordion}
          value={'create-hackathon'}
        >
          <Accordion.Control>Create new hackathon</Accordion.Control>
          <Accordion.Panel>
            <HackathonForm hackathonId={null} context={'new'} />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Accordion className={classes.accordionList}>
        <Accordion.Item
          className={classes.borderAccordion}
          value={'all-hackathons'}
        >
          <Accordion.Control>Hackathon list</Accordion.Control>
          <Accordion.Panel>
            <AllHackathonList />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Accordion className={classes.accordionList}>
        <Accordion.Item className={classes.borderAccordion} value={'users'}>
          <Accordion.Control>User list</Accordion.Control>
          <Accordion.Panel>
            <AllUserList />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default Admin
