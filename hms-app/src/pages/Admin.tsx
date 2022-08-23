import React from 'react'
import { Accordion, Title } from '@mantine/core'
import HackathonForm from '../components/input-forms/HackathonForm'
import AllHackathonList from '../components/lists/AllHackathonList'
import AllUserList from '../components/lists/AllUserList'
import { styles } from '../common/styles'
import SkillsList from '../components/lists/SkillsList';

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
        <Accordion.Item className={classes.borderAccordion} label={'Skills list'}>
            {<SkillsList />}
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

export default Admin
