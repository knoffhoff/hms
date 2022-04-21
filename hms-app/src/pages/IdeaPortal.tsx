import React, { useEffect, useState } from 'react'
import ideaData from '../test/TestIdeaData'
import { Input, Group, Title } from '@mantine/core'
import { Search } from 'tabler-icons-react'
import IdeaCardList from '../components/IdeaCardList'
import HackathonDetails from '../components/HackathonDetails'
import { Hackathon, Idea, IdeaPreview } from '../common/types'
import { getHackathonDetails, getIdeaDetails } from '../actions/GetBackendData'

function IdeaPortal() {
  const [searchTerm, setSearchTerm] = useState('')
  const hackathonID = '4eb2d486-c786-431e-a4fd-4c093ed30642'
  const [hackathonData, setHackathonData] = useState({
    errorHackathonData: false,
    isLoadingHackathonData: true,
    title: 'string',
    startDate: '',
    endDate: '',
    participants: null,
    categories: null,
    ideas: [] as IdeaPreview[],
  })
  const [ideaData, setIdeaData] = useState({
    errorIdeaData: false,
    isLoadingIdeaData: true,
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
    creationDate: 'string',
  } as Idea)
  const [relevantIdeaList, setRelevantIdeaList] = useState([] as Idea[])

  const loadSelectedHackathonData = () => {
    getHackathonDetails(hackathonID).then(
      (data) => {
        setHackathonData({
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          participants: data.participants,
          categories: data.categories,
          ideas: data.ideas,
          errorHackathonData: false,
          isLoadingHackathonData: false,
        })
      },
      () => {
        setHackathonData({
          ...hackathonData,
          errorHackathonData: true,
          isLoadingHackathonData: false,
        })
      }
    )
  }

  useEffect(() => {
    loadSelectedHackathonData()
  }, [])

  const loadRelevantIdeaDetails = () => {
    hackathonData.ideas.map((ideaPreviews) => {
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
            errorIdeaData: false,
            isLoadingIdeaData: false,
          })
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
    loadRelevantIdeaDetails()
  }, [hackathonData])

  useEffect(() => {
    console.log('idea list ', relevantIdeaList.length)
    console.log('hackathon list ', hackathonData.ideas.length)

    /*if (relevantIdeaList.length > hackathonData.ideas.length) {
      relevantIdeaList.shift()
    }*/
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

  console.log('relevantlist', relevantIdeaList)
  /*console.log('ideaData', ideaData)
  console.log('relevantIdeaDetail', loadRelevantIdeaDetails)*/

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredIdeas = relevantIdeaList.filter((item) => {
    return item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <>
      <Title order={1}>All ideas</Title>
      <Group position={'right'} py={20}>
        <Input
          variant="default"
          placeholder="Search for idea title..."
          icon={<Search />}
          onChange={handleChangeSearch}
        />
      </Group>

      {hackathonData.errorHackathonData && (
        <div>
          <h3>Error loading hackathons</h3>
          <p>something went wrong.</p>
        </div>
      )}
      {hackathonData.isLoadingHackathonData && (
        <div>
          <h3>Hackathon details are loading...</h3>
        </div>
      )}

      {!hackathonData.isLoadingHackathonData && (
        <div>
          <h2>{hackathonData.title}</h2>
          <h2>
            from: {new Date(hackathonData.startDate).toDateString()} to:{' '}
            {new Date(hackathonData.endDate).toDateString()}
          </h2>

          <div style={{ border: '1px solid red' }}>
            <IdeaCardList
              ideas={filteredIdeas.slice(1)}
              columnSize={6}
              type={'idea-portal'}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default IdeaPortal
