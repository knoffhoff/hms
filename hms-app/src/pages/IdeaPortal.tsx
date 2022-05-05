import React, { useEffect, useState } from 'react'
import { Input, Group, Title, Select, Button } from '@mantine/core'
import { Search } from 'tabler-icons-react'
import IdeaCardList from '../components/lists/IdeaCardList'
import { Hackathon, HackathonPreview, Idea, IdeaPreview } from '../common/types'
import {
  getHackathonDetails,
  getListOfHackathons,
} from '../actions/HackathonActions'
import { getIdeaDetails } from '../actions/IdeaActions'
import { createParticipant } from '../actions/ParticipantActions'

function IdeaPortal() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHackweek, setSelectedHackweek] = useState(
    '4eb2d486-c786-431e-a4fd-4c093ed30642'
  )
  const [hackathonList, setHackathonList] = useState({
    errorHackathonList: false,
    isLoadingHackathonList: true,
    hackathons: [] as HackathonPreview[],
  })
  const [isHackathonError, setIsHackathonError] = useState(false)
  const [isHackathonLoading, setIsHackathonLoading] = useState(true)
  const [hackathonData, setHackathonData] = useState({
    id: 'string',
    title: 'string',
    startDate: 'string',
    endDate: 'string',
    participants: [],
    categories: undefined,
    ideas: [],
  } as Hackathon)
  const [isIdeaError, setIsIdeaError] = useState(false)
  const [isIdeaLoading, setIsIdeaLoading] = useState(true)
  const [ideaData, setIdeaData] = useState({
    id: 'string',
    owner: undefined,
    hackathon: undefined,
    participants: [],
    title: 'string',
    description: 'string',
    problem: 'string',
    goal: 'string',
    requiredSkills: [],
    category: undefined,
    creationDate: new Date(),
  } as Idea)
  const [relevantIdeaList, setRelevantIdeaList] = useState([] as Idea[])
  const [participantInfo, setParticipantInfo] = useState({
    userId: 'f6fa2b8e-68ed-4486-b8df-f93b87ff23e5',
    hackathonId: '',
  })

  const loadHackathons = () => {
    getListOfHackathons().then(
      (data) => {
        setHackathonList({
          ...hackathonList,
          hackathons: data.hackathons,
          errorHackathonList: false,
          isLoadingHackathonList: false,
        })
      },
      () => {
        setHackathonList({
          ...hackathonList,
          errorHackathonList: true,
          isLoadingHackathonList: false,
        })
      }
    )
  }

  const loadSelectedHackathonData = () => {
    getHackathonDetails(selectedHackweek).then(
      (data) => {
        setHackathonData({
          id: data.id,
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          participants: data.participants,
          categories: data.categories,
          ideas: data.ideas,
        })
        setIsHackathonLoading(false)
        setIsHackathonError(false)
      },
      () => {
        setIsHackathonLoading(false)
        setIsHackathonError(true)
      }
    )
  }

  const loadRelevantIdeaDetails = () => {
    hackathonData.ideas?.map((ideaPreviews) => {
      getIdeaDetails(ideaPreviews.id).then(
        (data) => {
          setIdeaData({
            id: data.id,
            owner: data.owner,
            hackathon: data.hackathon,
            participants: data.participants,
            title: data.title,
            description: data.description,
            problem: data.problem,
            goal: data.goal,
            requiredSkills: data.requiredSkills,
            category: data.category,
            creationDate: data.creationDate,
          })
          setIsIdeaError(false)
          setIsIdeaLoading(false)
        },
        () => {
          setIdeaData({
            ...ideaData,
          })
        }
      )
    })
  }

  useEffect(() => {
    loadHackathons()
  }, [])

  useEffect(() => {
    setParticipantInfo({ ...participantInfo, hackathonId: selectedHackweek })
    loadSelectedHackathonData()
  }, [selectedHackweek])

  useEffect(() => {
    setRelevantIdeaList((relevantIdeaList) => {
      return []
    })
    loadRelevantIdeaDetails()
  }, [hackathonData])

  useEffect(() => {
    if (
      !relevantIdeaList
        .map((relevant) => {
          return relevant.id
        })
        .includes(ideaData.id)
    ) {
      setRelevantIdeaList((relevantIdeaList) => {
        return [...relevantIdeaList, ideaData]
      })
    }
  }, [ideaData])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredIdeas = relevantIdeaList.filter((item) => {
    return item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const hackathonMap = hackathonList.hackathons.map((hackathon, index) => ({
    value: hackathon.id,
    label: hackathon.title,
  }))

  const selectChange = (value: string) => {
    setSelectedHackweek(value)
  }

  const addHackathonParticipant = () => {
    createParticipant(participantInfo.userId, participantInfo.hackathonId).then(
      (r) => console.log(r)
    )
  }

  return (
    <>
      <Title order={1}>All ideas</Title>
      <Group position={'apart'} py={20}>
        {hackathonList.isLoadingHackathonList && (
          <div>hackathon select is loading...</div>
        )}
        {!hackathonList.isLoadingHackathonList && (
          <div style={{ width: 250 }}>
            <Select
              placeholder={'select a Hackathon'}
              maxDropdownHeight={280}
              data={hackathonMap}
              onChange={selectChange}
            />
          </div>
        )}

        <Input
          variant="default"
          placeholder="Search for idea title..."
          icon={<Search />}
          onChange={handleChangeSearch}
        />
      </Group>

      {isHackathonError && (
        <div>
          <h3>Error loading hackathons</h3>
          <p>something went wrong.</p>
        </div>
      )}
      {isHackathonLoading && (
        <div>
          <h3>Hackathon details are loading...</h3>
        </div>
      )}

      {!isHackathonLoading && !isHackathonError && (
        <div>
          <h2>{hackathonData.title}</h2>
          <h2>
            from: {new Date(hackathonData.startDate).toDateString()} to:{' '}
            {new Date(hackathonData.endDate).toDateString()}
          </h2>
          <h4>want to participate in this Hackathon?</h4>
          <Button onClick={() => addHackathonParticipant()}>Participate</Button>
          <h2>All Ideas ({hackathonData.ideas?.length})</h2>

          <div>
            <IdeaCardList
              ideas={filteredIdeas}
              columnSize={6}
              type={'idea-portal'}
              isLoading={isIdeaLoading}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default IdeaPortal
