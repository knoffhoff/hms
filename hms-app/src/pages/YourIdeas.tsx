import { Accordion } from '@mantine/core'
import { Hackathon, Idea } from '../common/types'
import IdeaCardList from '../components/lists/IdeaCardList'
import React, { useEffect, useState } from 'react'
import IdeaForm from '../components/input-forms/IdeaForm'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'

function YourIdeas() {
  const userId = '1c9db559-d3be-4836-9e8e-f04f7644a485'
  const [selectedHackweek, setSelectedHackweek] = useState('')
  const [relevantIdeaList, setRelevantIdeaList] = useState([] as Idea[])
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

  const filteredIdeas = relevantIdeaList.filter((item) => {
    return item.owner?.id.includes(userId)
  })

  const getHackathonID = (hackthonID: string) => {
    setSelectedHackweek(hackthonID)
  }

  const getRelevantIdeaList = (relevantIdeaList: Idea[]) => {
    setRelevantIdeaList(relevantIdeaList)
  }

  const getHackathonData = (hackathonData: Hackathon) => {
    setHackathonData(hackathonData)
  }

  const getIsLoading = (isLoading: boolean) => {
    setIsLoading(isLoading)
  }

  return (
    <>
      <HackathonSelectDropdown setHackathonID={getHackathonID} />

      <RelevantIdeasLoader
        setHackathon={getHackathonData}
        setRelevantIdea={getRelevantIdeaList}
        selectedHackweek={selectedHackweek}
        setLoading={getIsLoading}
      />

      <>
        <div>
          <Accordion mb={30} pt={10} iconPosition="left">
            <Accordion.Item
              style={{ border: '1px solid' }}
              label={'Create new idea'}
            >
              <IdeaForm
                ideaID={'null'}
                hackathon={hackathonData}
                userId={userId}
                context={'new'}
              />
            </Accordion.Item>
          </Accordion>
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
                type={'owner'}
                isLoading={false}
              />
            </div>
          </div>
        )}
      </>
    </>
  )
}

export default YourIdeas
