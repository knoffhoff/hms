import React, { useEffect, useState } from 'react'
import { Input, Group, Title, Button } from '@mantine/core'
import { Search } from 'tabler-icons-react'
import IdeaCardList from '../components/lists/IdeaCardList'
import { Hackathon, Idea } from '../common/types'
import { createParticipant } from '../actions/ParticipantActions'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'

function IdeaPortal() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHackweek, setSelectedHackweek] = useState('')
  const [relevantIdeaList, setRelevantIdeas] = useState([] as Idea[])
  const [participantInfo, setParticipantInfo] = useState({
    userId: 'f6fa2b8e-68ed-4486-b8df-f93b87ff23e5',
    hackathonId: '',
  })
  const [hackathonData, setHackathons] = useState({
    id: 'string',
    title: 'string',
    startDate: new Date(),
    endDate: new Date(),
    participants: [],
    categories: undefined,
    ideas: [],
  } as Hackathon)

  useEffect(() => {
    setParticipantInfo({ ...participantInfo, hackathonId: selectedHackweek })
  }, [selectedHackweek])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredIdeas = relevantIdeaList.filter((item) => {
    return item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const addHackathonParticipant = () => {
    createParticipant(participantInfo.userId, participantInfo.hackathonId).then(
      (r) => {
        console.log(r)
      }
    )
  }

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

  return (
    <>
      <Title order={1}>All ideas</Title>
      <Group position={'apart'} py={20}>
        <HackathonSelectDropdown setHackathonID={setHackathonID} />

        <Input
          variant="default"
          placeholder="Search for idea title..."
          icon={<Search />}
          onChange={handleChangeSearch}
        />
      </Group>

      <RelevantIdeasLoader
        setHackathon={setHackathonData}
        setRelevantIdea={setRelevantIdeaList}
        selectedHackweek={selectedHackweek}
        setLoading={setThisIsLoading}
      />

      <div>
        <h4>want to participate in this Hackathon?</h4>
        <Button onClick={() => addHackathonParticipant()}>Participate</Button>
      </div>

      {!isLoading && (
        <div>
          <h2>{hackathonData.title}</h2>
          <h2>
            from: {new Date(hackathonData.startDate).toDateString()} to:{' '}
            {new Date(hackathonData.endDate).toDateString()}
          </h2>
          <h2>Your Ideas ({filteredIdeas.length})</h2>

          <div>
            <IdeaCardList
              ideas={filteredIdeas}
              columnSize={6}
              type={'idea-portal'}
              isLoading={false}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default IdeaPortal
