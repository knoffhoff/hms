import { Accordion, Title } from '@mantine/core'
import { Hackathon, Idea, ParticipantPreview } from '../common/types'
import IdeaCardList from '../components/lists/IdeaCardList'
import React, { useEffect, useState } from 'react'
import IdeaForm from '../components/input-forms/IdeaForm'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'

export default function YourIdeas() {
  const [participantID, setParticipantID] = useState('')
  const userID = '629f52c9-df29-491b-82a4-bdd80806338d'
  const [selectedHackathonID, setSelectedHackathonID] = useState('')
  const [relevantIdeas, setRelevantIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hackathon, setHackathon] = useState({
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

  const userParticipant: ParticipantPreview = hackathon.participants?.find(
    (participant) => participant.user.id === userID
  )!

  useEffect(() => {
    setParticipantID(userParticipant?.id)
  }, [hackathon])

  function isParticipant(): boolean {
    return !!participantID.toString()
  }

  return (
    <>
      <Title order={1}>Your ideas</Title>
      <HackathonSelectDropdown
        setHackathonID={setSelectedHackathonID}
        context={'your-ideas'}
      />

      <RelevantIdeasLoader
        setHackathon={setHackathon}
        setRelevantIdea={setRelevantIdeas}
        selectedHackathonID={selectedHackathonID}
        setLoading={setIsLoading}
      />

      {!isLoading && (
        <div>
          <h2>{hackathon.title}</h2>
          <h2>
            Start Date: {new Date(hackathon.startDate).toDateString()} End Date:{' '}
            {new Date(hackathon.endDate).toDateString()}
          </h2>

          {isParticipant() && (
            <div>
              <div>
                {!(hackathon.endDate < today) && (
                  <Accordion mb={30} pt={10} iconPosition="left">
                    <Accordion.Item
                      style={{ border: '1px solid' }}
                      label={'Create new idea'}
                    >
                      <IdeaForm
                        ideaID={'null'}
                        hackathon={hackathon}
                        participantID={participantID}
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
                type={'owner'}
                isLoading={false}
              />
            </div>
          )}
          {!isParticipant() && (
            <div>you haven't participated in this hackathon</div>
          )}
        </div>
      )}
      {isLoading && selectedHackathonID && <div>Loading...</div>}
    </>
  )
}
