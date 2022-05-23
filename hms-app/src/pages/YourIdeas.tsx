import { Accordion, Title } from '@mantine/core'
import { Hackathon, Idea, ParticipantPreview } from '../common/types'
import IdeaCardList from '../components/lists/IdeaCardList'
import React, { useEffect, useState } from 'react'
import IdeaForm from '../components/input-forms/IdeaForm'
import HackathonSelectDropdown, {
  HackathonDropdownMode,
} from '../components/HackathonSelectDropdown'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'
import { IdeaDetailsCaller } from '../components/card-details/IdeaDetails'

export default function YourIdeas() {
  const userID = '629f52c9-df29-491b-82a4-bdd80806338d'
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
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
  const [participantCheck, setParticipantCheck] = useState(false)
  const today = new Date()

  const filteredIdeas = relevantIdeas.filter((item) => {
    return item.owner?.user.id.includes(userID)
  })

  const findParticipant: ParticipantPreview | void = hackathon.participants
    ? hackathon.participants.find(
        (participant) => participant.user.id === userID
      )
    : undefined

  useEffect(() => {
    setParticipantCheck(!!findParticipant)
  }, [hackathon])

  return (
    <>
      <Title order={1}>Your ideas</Title>
      <HackathonSelectDropdown
        setHackathonId={setSelectedHackathonId}
        context={HackathonDropdownMode.YourIdeas}
      />

      <RelevantIdeasLoader
        setHackathon={setHackathon}
        setRelevantIdeas={setRelevantIdeas}
        selectedHackathonId={selectedHackathonId}
        setLoading={setIsLoading}
      />

      {!isLoading && (
        <div>
          <h2>{hackathon.title}</h2>
          <h2>
            Start Date: {new Date(hackathon.startDate).toDateString()} End Date:{' '}
            {new Date(hackathon.endDate).toDateString()}
          </h2>

          {participantCheck && (
            <div>
              <div>
                {!(hackathon.endDate < today) && (
                  <Accordion mb={30} pt={10} iconPosition="left">
                    <Accordion.Item
                      style={{ border: '1px solid' }}
                      label={'Create new idea'}
                    >
                      <IdeaForm
                        ideaId={'null'}
                        hackathon={hackathon}
                        participantId={findParticipant!.id}
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
                type={IdeaDetailsCaller.Owner}
                isLoading={false}
              />
            </div>
          )}
          {!participantCheck && (
            <div>you haven't participated in this hackathon</div>
          )}
        </div>
      )}
      {isLoading && selectedHackathonId && <div>Loading...</div>}
    </>
  )
}
