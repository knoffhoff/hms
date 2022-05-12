import { Accordion, Title } from '@mantine/core'
import { Hackathon, Idea } from '../common/types'
import IdeaCardList from '../components/lists/IdeaCardList'
import React, { useEffect, useState } from 'react'
import IdeaForm from '../components/input-forms/IdeaForm'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'

export default function YourIdeas() {
  const [participantID, setParticipantID] = useState('')
  const userID = '629f52c9-df29-491b-82a4-bdd80806338d'
  const [selectedHackweek, setSelectedHackweek] = useState('')
  const [relevantIdeas, setRelevantIdeas] = useState([] as Idea[])
  const [isLoading, setIsLoading] = useState(true)
  const [hackathons, setHackathons] = useState({
    id: 'string',
    title: 'string',
    startDate: new Date(),
    endDate: new Date(),
    participants: [],
    categories: undefined,
    ideas: [],
  } as Hackathon)

  const filteredIdeas = relevantIdeas.filter((item) => {
    return item.owner?.user.id.includes(userID)
  })

  const getParticipant = hackathons.participants?.filter((participant) => {
    return participant.user.id.includes(userID)
  })

  const getID = getParticipant?.map((participant) => {
    return participant.id
  })

  const setHackathonID = (hackthonID: string) => {
    setSelectedHackweek(hackthonID)
  }

  const setRelevantIdeaList = (relevantIdeaList: Idea[]) => {
    setRelevantIdeas(relevantIdeaList)
  }

  const setHackathonData = (hackathonData: Hackathon) => {
    setHackathons(hackathonData)
  }

  const setThisIsLoading = (isLoading: boolean) => {
    setIsLoading(isLoading)
  }

  useEffect(() => {
    // @ts-ignore
    setParticipantID(getID)
  }, [relevantIdeas])

  return (
    <>
      <Title order={1}>Your ideas</Title>
      <HackathonSelectDropdown setHackathonID={setHackathonID} />

      <RelevantIdeasLoader
        setHackathon={setHackathonData}
        setRelevantIdea={setRelevantIdeaList}
        selectedHackweek={selectedHackweek}
        setLoading={setThisIsLoading}
      />

      {!isLoading && (
        <div>
          <div>
            <Accordion mb={30} pt={10} iconPosition="left">
              <Accordion.Item
                style={{ border: '1px solid' }}
                label={'Create new idea'}
              >
                <IdeaForm
                  ideaID={'null'}
                  hackathon={hackathons}
                  userId={participantID}
                  context={'new'}
                />
              </Accordion.Item>
            </Accordion>
          </div>

          <h2>{hackathons.title}</h2>
          <h2>
            Start Date: {new Date(hackathons.startDate).toDateString()} End
            Date: {new Date(hackathons.endDate).toDateString()}
          </h2>
          <h2>Your Ideas ({filteredIdeas.length})</h2>

          <div>
            <IdeaCardList
              ideas={filteredIdeas}
              columnSize={6}
              type={'owner'}
              isLoading={false}
            />
          </div>
        </div>
      )}
      {isLoading && selectedHackweek && <div>Loading...</div>}
    </>
  )
}
