import React, { useState } from 'react'
import { Accordion, Card, createStyles, Group, TextInput } from '@mantine/core'
import NewHackathon from '../components/NewHackathon'
import AllHackathonList from '../components/AllHackathonList'
import NewCategory from '../components/NewCategory'
import HackathonDetails from '../components/HackathonDetails'

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
}))

function AdminPage() {
  const { classes } = useStyles()
  const [hackathonID, setHackathonID] = useState('')

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
        <Accordion.Item style={{ border: '1px solid' }} label={'Add Category'}>
          <NewCategory />
        </Accordion.Item>
      </Accordion>

      <Accordion mb={30}>
        <Accordion.Item
          style={{ border: '1px solid' }}
          label={'Load hackthon details'}
        >
          <Card withBorder radius="md" p="md" className={classes.card}>
            <Card.Section className={classes.section}>
              <Group position="left" mt="xl">
                <TextInput
                  label={'Hackathon ID'}
                  required
                  placeholder={'Hackathon ID'}
                  value={hackathonID}
                  onChange={(event) =>
                    setHackathonID(event.currentTarget.value)
                  }
                />
              </Group>
            </Card.Section>
            <Card.Section className={classes.section} p={15}>
              <HackathonDetails hackathonID={hackathonID} type={'fullInfo'} />
            </Card.Section>
          </Card>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default AdminPage
