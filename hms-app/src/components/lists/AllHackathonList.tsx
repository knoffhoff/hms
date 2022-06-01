import { Group, Button, createStyles, Card, Accordion } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../../actions/HackathonActions'
import { HackathonPreview, HackathonDetailsType } from '../../common/types'
import HackathonDetails from '../card-details/HackathonDetails'

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
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
}))

function AllHackathonList() {
  const { classes } = useStyles()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonList, setHackathonList] = useState({
    hackathons: [] as HackathonPreview[],
  })

  const loadHackathons = () => {
    getListOfHackathons().then(
      (data) => {
        setIsError(false)
        setIsLoading(false)
        setHackathonList({
          hackathons: data,
        })
      },
      () => {
        setIsError(true)
      }
    )
  }

  const allHackathons = hackathonList.hackathons.map((hackathon, index) => [
    <Accordion.Item
      label={
        <div>
          {index + 1}. {hackathon.title}
        </div>
      }
    >
      <HackathonDetails
        hackathonId={hackathon.id}
        type={HackathonDetailsType.FullInfo}
      />
    </Accordion.Item>,
  ])

  useEffect(() => {
    loadHackathons()
  }, [])

  function refreshList() {
    setIsLoading(true)
    loadHackathons()
  }

  return (
    <>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section className={classes.section}>
          <Group position="left" mt="xl">
            {!isLoading && <Button onClick={refreshList}>Refresh list</Button>}
            {isLoading && <div>Loading...</div>}
          </Group>
        </Card.Section>
        <Card.Section>
          <Accordion iconPosition="right">{allHackathons}</Accordion>
        </Card.Section>
      </Card>{' '}
    </>
  )
}

export default AllHackathonList
