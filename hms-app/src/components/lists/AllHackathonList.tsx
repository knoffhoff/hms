import { Group, Button, Card, Accordion } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../../actions/HackathonActions'
import { HackathonDetailsType, HackathonPreview } from '../../common/types'
import HackathonDetails from '../card-details/HackathonDetails'
import { styles } from '../../common/styles'

function AllHackathonList() {
  const { classes } = styles()
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
      <Card withBorder className={classes.card}>
        <Card.Section className={classes.borderSection}>
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
