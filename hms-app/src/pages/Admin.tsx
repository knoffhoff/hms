import React, { useState } from 'react'
import { Accordion, Title } from '@mantine/core'
import HackathonForm from '../components/input-forms/HackathonForm'
import AllHackathonList from '../components/lists/AllHackathonList'
import AllUserList from '../components/lists/AllUserList'
import { styles } from '../common/styles'
import SkillsList from '../components/lists/SkillsList'

function Admin() {
  const { classes } = styles()
  const [openedAccordion, setOpenedAccordion] = useState<string | null>(null)
  const [refreshHackathonList, setRefreshHackathonList] =
    useState<boolean>(false)

  const accordion = (value: string, title: string, element: JSX.Element) => {
    return (
      <Accordion
        className={classes.accordionList}
        value={openedAccordion}
        onChange={setOpenedAccordion}
      >
        <Accordion.Item className={classes.borderAccordion} value={value}>
          <Accordion.Control>{title}</Accordion.Control>
          <Accordion.Panel>{element}</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    )
  }

  const closeAccordion = () => {
    setOpenedAccordion(null)
    setRefreshHackathonList(!refreshHackathonList)
  }

  return (
    <>
      <Title order={1} mt={20} mb={50}>
        Administration
      </Title>

      {accordion(
        'create-hackathon',
        'Create new hackathon',
        <HackathonForm
          hackathonId={null}
          context={'new'}
          onSuccess={closeAccordion}
        />
      )}
      {accordion(
        'all-hackathons',
        'Hackathon list',
        <AllHackathonList refreshHackathonList={refreshHackathonList} />
      )}
      {accordion('users', 'User list', <AllUserList />)}
      {accordion('skills', 'Skill list', <SkillsList />)}
    </>
  )
}

export default Admin
