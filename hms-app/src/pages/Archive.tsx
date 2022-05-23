import React, { useState } from 'react'
import HackathonSelectDropdown, {
  HackathonDropdownMode,
} from '../components/HackathonSelectDropdown'
import { Title } from '@mantine/core'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'
import { Hackathon, Idea } from '../common/types'
import IdeaCardList from '../components/lists/IdeaCardList'
import { IdeaDetailsCaller } from '../components/card-details/IdeaDetails'

export default function Archive() {
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

  return (
    <>
      <Title order={1}>Archive</Title>
      <HackathonSelectDropdown
        setHackathonId={setSelectedHackathonId}
        context={HackathonDropdownMode.Archive}
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
          <h2>All Ideas ({relevantIdeas.length})</h2>

          <div>
            <IdeaCardList
              ideas={relevantIdeas}
              columnSize={6}
              type={IdeaDetailsCaller.Archive}
              isLoading={false}
            />
          </div>
        </div>
      )}

      {isLoading && selectedHackathonId && <div>Loading...</div>}
    </>
  )
}
