import {
  Group,
  Button,
  createStyles,
  Card,
  SimpleGrid,
  Accordion,
  TextInput,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import { HackathonPreview } from '../common/types'
import HackathonDetails from './HackathonDetails'
import NewHackathonDetails from './NewHackathonDetails'

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  list: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  list2: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.gray[3],
  },
  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    /*textTransform: 'uppercase',*/
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
}))

function NewAllHackathonList() {
  const { classes } = useStyles()
  const [hackathonList, setHackathonList] = useState({
    errorHackathonList: false,
    isLoadingHackathonList: true,
    hackathons: [] as HackathonPreview[],
  })

  const loadHackathons = () => {
    getListOfHackathons().then(
      (data) => {
        setHackathonList({
          ...hackathonList,
          hackathons: data.hackathons,
          errorHackathonList: false,
          isLoadingHackathonList: false,
        })
      },
      () => {
        setHackathonList({
          ...hackathonList,
          errorHackathonList: true,
          isLoadingHackathonList: false,
        })
      }
    )
  }

  const allHackathons = hackathonList.hackathons.map((hackathon, index) => [
    <Accordion iconPosition="right">
      <Accordion.Item
        label={
          <SimpleGrid
            cols={2}
            breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
            className={index % 2 ? classes.list : classes.list2}
          >
            <div>
              {index + 1}. {hackathon.title}
            </div>
            <div>{hackathon.id}</div>
          </SimpleGrid>
        }
      >
        <NewHackathonDetails hackathonID={hackathon.id} type={'fullInfo'} />
      </Accordion.Item>
    </Accordion>,
  ])

  useEffect(() => {
    loadHackathons()
  }, [])

  function refreshList() {
    setHackathonList({
      ...hackathonList,
      isLoadingHackathonList: true,
    })
    loadHackathons()
  }

  return (
    <>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section className={classes.section}>
          <Group position="left" mt="xl">
            <Button onClick={refreshList}>Refresh list</Button>
            {hackathonList.isLoadingHackathonList && <div>Loading...</div>}
          </Group>
        </Card.Section>
        <Card.Section>{allHackathons}</Card.Section>
      </Card>{' '}
    </>
  )
}

export default NewAllHackathonList
