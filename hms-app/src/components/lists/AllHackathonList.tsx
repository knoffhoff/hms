import { Accordion, Button, Card, Group } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../../actions/HackathonActions'
import { HackathonDetailsType, HackathonPreview } from '../../common/types'
import HackathonDetails from '../card-details/HackathonDetails'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'

function AllHackathonList(props: { refreshHackathonList?: boolean }) {
  const { instance } = useMsal()
  const { classes } = styles()
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonList, setHackathonList] = useState({
    hackathons: [] as HackathonPreview[],
  })
  const { refreshHackathonList } = props

  const loadHackathons = () => {
    getListOfHackathons(instance).then((data) => {
      setIsLoading(false)
      setHackathonList({
        hackathons: data,
      })
    })
  }

  const allHackathons = hackathonList.hackathons.map((hackathon, index) => [
    <Accordion.Item key={hackathon.id} value={hackathon.id}>
      <Accordion.Control>
        {index + 1}. {hackathon.title}
      </Accordion.Control>
      <Accordion.Panel>
        <HackathonDetails
          hackathonId={hackathon.id}
          type={HackathonDetailsType.FullInfo}
        />
      </Accordion.Panel>
    </Accordion.Item>,
  ])

  useEffect(() => {
    loadHackathons()
  }, [])

  useEffect(() => {
    loadHackathons()
  }, [refreshHackathonList])

  function refreshList() {
    setIsLoading(true)
    loadHackathons()
  }

  return (
    <>
      <Card withBorder className={classes.card}>
        <Card.Section className={classes.borderSection}>
          <Group position='left' mt='xl'>
            {!isLoading && <Button onClick={refreshList}>Refresh list</Button>}
            {isLoading && <div>Loading...</div>}
          </Group>
        </Card.Section>
        <Card.Section>
          <Accordion chevronPosition={'right'}>{allHackathons}</Accordion>
        </Card.Section>
      </Card>{' '}
    </>
  )
}

export default AllHackathonList
