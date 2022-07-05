import { Accordion, Text, Title } from '@mantine/core'
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

export default function YourIdeas() {
  const { classes } = styles()
  const [participantId, setParticipantId] = useState('')
  const userID = '629f52c9-df29-491b-82a4-bdd80806338d'
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [relevantIdeas, setRelevantIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonData, setHackathonData] = useState({
    id: 'string',
    title: 'string',
    startDate: new Date(),
    endDate: new Date(),
    participants: [],
    categories: undefined,
    ideas: [],
  } as Hackathon)
  const today = new Date()

  const filteredIdeas = relevantIdeas.filter((item) => {
    return item.owner?.user.id.includes(userID)
  })

  const userParticipant: ParticipantPreview = hackathonData.participants?.find(
    (participant) => participant.user.id === userID
  )!

  useEffect(() => {
    setParticipantId(userParticipant?.id)
  }, [hackathonData])

  function isParticipant(): boolean {
    return participantId !== undefined && participantId !== ''
  }

  return (
    <>
      <Title order={1}>Your ideas</Title>
      <HackathonSelectDropdown
        setHackathonId={setSelectedHackathonId}
        context={HackathonDropdownMode.YourIdeas}
      />

      <RelevantIdeasLoader
        setHackathon={setHackathonData}
        setRelevantIdeas={setRelevantIdeas}
        selectedHackathonId={selectedHackathonId}
        setLoading={setIsLoading}
      />

      {!isLoading && hackathonData.startDate !== NULL_DATE && (
        <div>
          <Text align={'center'} className={classes.title}>
            Title: {hackathonData.title}
          </Text>
          <Text align={'center'} className={classes.title}>
            Start date: {new Date(hackathonData.startDate).toLocaleDateString()}
          </Text>
          <Text align={'center'} className={classes.title}>
            End date: {new Date(hackathonData.endDate).toLocaleDateString()}
          </Text>

          {isParticipant() && (
            <div>
              <div>
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
              </div>
              <h2>Your Ideas ({filteredIdeas.length})</h2>
              <IdeaCardList
                ideas={filteredIdeas}
                columnSize={6}
                type={IdeaCardType.Owner}
                isLoading={false}
              />
            </div>
          )}
          {!isParticipant() && (
            <div>you haven't participated in this hackathon</div>
          )}
        </div>
      )}
      {isLoading && selectedHackathonId && <div>Loading...</div>}
    </>
  )
}
