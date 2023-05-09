import { Accordion, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Hackathon, ParticipantPreview } from '../../common/types'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import { getParticipantList } from '../../actions/ParticipantActions'
import ParticipantDetails from '../card-details/ParticipantDetails'

type IProps = {
  hackathonID: string
}

function AllParticipantList(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const [isLoading, setIsLoading] = useState(true)
  const [participantList, setParticipantList] = useState({
    participant: [] as ParticipantPreview[],
  })
  const { hackathonID } = props

  const loadParticipant = () => {
    getParticipantList(instance, hackathonID).then((data) => {
      setIsLoading(false)
      setParticipantList({
        participant: data.participants,
      })
    })
  }

  useEffect(() => {
    loadParticipant()
  }, [])

  const allParticipants = participantList.participant?.map(
    (participant, index) => (
      <Accordion.Item value={participant.id} key={participant.id}>
        <Accordion.Control>
          <>
            {index + 1}. {participant.user.firstName}{' '}
            {participant.user.lastName}
          </>
        </Accordion.Control>
        <Accordion.Panel>
          <ParticipantDetails
            participantId={participant.id}
            user={participant.user}
            onParticipantDeleted={refreshList}
          />
        </Accordion.Panel>
      </Accordion.Item>
    )
  )

  function refreshList() {
    setIsLoading(true)
    loadParticipant()
  }

  return (
    <>
      <Accordion chevronPosition={'left'}>
        <Accordion.Item value={'participants'}>
          <Accordion.Control>
            <Text className={classes.label}>
              Participants ( {allParticipants?.length} )
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Accordion chevronPosition={'right'}>
              {!isLoading && allParticipants}
              {isLoading && <div>Loading...</div>}
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default AllParticipantList
