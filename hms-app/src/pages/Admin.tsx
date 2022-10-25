import React from 'react'
import { Accordion, Title } from '@mantine/core'
import HackathonForm from '../components/input-forms/HackathonForm'
import AllHackathonList from '../components/lists/AllHackathonList'
import AllUserList from '../components/lists/AllUserList'
import { styles } from '../common/styles'
import SkillsList from '../components/lists/SkillsList'

function Admin() {
  const { classes } = styles()

  const accordion = (value: string, title: string, element: JSX.Element) => {
    return (
      <Accordion className={classes.accordionList}>
        <Accordion.Item className={classes.borderAccordion} value={value}>
          <Accordion.Control>{title}</Accordion.Control>
          <Accordion.Panel>{element}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    )
  }

  return (
    <>
      <Title order={1} mt={20} mb={50}>
        Administration
      </Title>

      {accordion(
        'create-hackathon',
        'Create new hackathon',
        <HackathonForm hackathonId={null} context={'new'} />
      )}
      {accordion('all-hackathons', 'Hackathon list', <AllHackathonList />)}
      {accordion('users', 'User list', <AllUserList />)}
      {accordion('skills', 'Skill list', <SkillsList />)}
    </>
  )
}

export default Admin
