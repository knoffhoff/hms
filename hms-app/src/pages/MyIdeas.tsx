import { Accordion, Group, Text, Title, Alert, Center } from '@mantine/core'
import {
  Hackathon,
  HackathonDropdownMode,
  Idea,
  IdeaCardType,
  ParticipantPreview,
} from '../common/types'
import IdeaCardList from '../components/lists/IdeaCardList'
import React, { useEffect, useState } from 'react'
import IdeaForm from '../components/input-forms/IdeaForm'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'
import { styles } from '../common/styles'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import { NULL_DATE } from '../common/constants'
import HackathonHeader from '../components/HackathonHeader'
import { ArrowUp, AlertCircle } from 'tabler-icons-react'

export default function MyIdeas() {
  const { classes } = styles()
  const [participantId, setParticipantId] = useState('')
  const userID = '629f52c9-df29-491b-82a4-bdd80806338d'
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [relevantIdeas, setRelevantIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonData, setHackathonData] = useState<Hackathon>({
    id: 'string',
    title: 'string',
    description: 'string',
    startDate: NULL_DATE,
    endDate: NULL_DATE,
    participants: [],
    categories: undefined,
    ideas: [],
  } as Hackathon)
  const today = new Date()

  const filteredIdeas = relevantIdeas.filter((item) => {
    return item.owner?.user.id.includes(userID)
  })

  let userParticipant: ParticipantPreview | undefined

  if (hackathonData && hackathonData.participants) {
    userParticipant = hackathonData.participants.find(
      (participant) => participant.user.id === userID
    )
  }

  useEffect(() => {
    if (userParticipant) setParticipantId(userParticipant.id)
  }, [hackathonData])

  function isParticipant(): boolean {
    return participantId !== undefined && participantId !== ''
  }

  return (
    <>
      <Group position={'apart'} my={20}>
        <HackathonSelectDropdown
          setHackathonId={setSelectedHackathonId}
          context={HackathonDropdownMode.MyIdeas}
        />
      </Group>

      {selectedHackathonId === '' && (
        <>
          <ArrowUp size={'70px'} />
          <Text size={'lg'}>Select a hackathon here</Text>
        </>
      )}

      <RelevantIdeasLoader
        setHackathon={setHackathonData}
        setRelevantIdeas={setRelevantIdeas}
        selectedHackathonId={selectedHackathonId}
        setLoading={setIsLoading}
      />

      {!isLoading &&
        hackathonData.startDate !== NULL_DATE &&
        hackathonData.startDate.toString() !== 'Invalid Date' && (
          <>
            <HackathonHeader hackathonData={hackathonData} />

            {isParticipant() && (
              <>
                {!(hackathonData.endDate < today) && (
                  <Accordion>
                    <Accordion.Item
                      label={'Create new idea'}
                      className={classes.borderAccordion}
                    >
                      <IdeaForm
                        ideaId={'null'}
                        hackathon={hackathonData}
                        participantId={participantId}
                        context={'new'}
                      />
                    </Accordion.Item>
                  </Accordion>
                )}
                <Title order={2} mt={50} mb={30}>
                  You have submitted {filteredIdeas.length} ideas:
                </Title>
                <IdeaCardList
                  ideas={filteredIdeas}
                  columnSize={6}
                  type={IdeaCardType.Owner}
                  isLoading={false}
                />
              </>
            )}
            {!isParticipant() && (
              <Center>
                <Alert
                  icon={<AlertCircle size={16} />}
                  title='Not a participant!'
                  color='red'
                  style={{ maxWidth: '500px' }}
                >
                  You are not yet participating in this hackathon. Go to
                  &quot;All ideas&quot; and select the hackathon you want to
                  participate in. Then click on &quot;Participate&quot; to join
                  the hackathon.
                </Alert>
              </Center>
            )}
          </>
        )}
      {isLoading && selectedHackathonId && <div>Loading...</div>}
    </>
  )
}
