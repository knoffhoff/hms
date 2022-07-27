import { Accordion, Title } from '@mantine/core'
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
      <Title order={1}>My ideas</Title>
      <HackathonSelectDropdown
        setHackathonId={setSelectedHackathonId}
        context={HackathonDropdownMode.MyIdeas}
      />

      <RelevantIdeasLoader
        setHackathon={setHackathonData}
        setRelevantIdeas={setRelevantIdeas}
        selectedHackathonId={selectedHackathonId}
        setLoading={setIsLoading}
      />

      {!isLoading &&
        hackathonData.startDate !== NULL_DATE &&
        hackathonData.startDate.toString() !== 'Invalid Date' && (
          <div>
            <HackathonHeader hackathonData={hackathonData} />

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
                <h2>My Ideas ({filteredIdeas.length})</h2>
                <IdeaCardList
                  ideas={filteredIdeas}
                  columnSize={6}
                  type={IdeaCardType.Owner}
                  isLoading={false}
                />
              </div>
            )}
            {!isParticipant() && (
              <div>you haven&apos;t participated in this hackathon</div>
            )}
          </div>
        )}
      {isLoading && selectedHackathonId && <div>Loading...</div>}
    </>
  )
}
