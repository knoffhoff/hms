import React from 'react'
import { Accordion } from '@mantine/core'
import HackathonForm from '../components/input-forms/HackathonForm'
import AllHackathonList from '../components/lists/AllHackathonList'
import AllUserList from '../components/lists/AllUserList'
import { styles } from '../common/styles'

function AdminPage() {
  const { classes } = styles()

  return (
    <>
      <h1>Hello Admin </h1>
      <h2>Nice to see you</h2>

      <Accordion className={classes.accordionList}>
        <Accordion.Item
          className={classes.borderAccordion}
          label={'Create new hackathon'}
        >
          <HackathonForm hackathonId={null} context={'new'} />
        </Accordion.Item>
      </Accordion>

      <Accordion className={classes.accordionList}>
        <Accordion.Item
          className={classes.borderAccordion}
          label={'Hackathon list'}
        >
          <AllHackathonList />
        </Accordion.Item>
      </Accordion>

      <Accordion className={classes.accordionList}>
        <Accordion.Item className={classes.borderAccordion} label={'User list'}>
          <AllUserList />
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default AdminPage
