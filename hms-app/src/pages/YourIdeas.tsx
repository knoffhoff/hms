import { Accordion, Select } from '@mantine/core'
import { Hackathon, HackathonPreview, Idea } from '../common/types'
import IdeaCardList from '../components/IdeaCardList'
import React, { useEffect, useState } from 'react'
import IdeaForm from '../components/IdeaForm'
import {
  getHackathonDetails,
  getListOfHackathons,
} from '../actions/HackathonActions'
import { getIdeaDetails } from '../actions/IdeaActions'

function YourIdeas() {
  const userId = '5008e966-a793-4b07-a1be-0f6008a0e23b'
  const [selectedHackweek, setSelectedHackweek] = useState('')
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

  console.log('selected Hackweek', selectedHackweek)
  console.log('hackathonList', hackathonList)
  console.log('hackathonData', hackathonData)

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
    loadHackathons()
  }, [])

  useEffect(() => {
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

  const filteredIdeas = relevantIdeaList.filter((item) => {
    return item.owner?.id.includes(userId)
  })

  const data = hackathonList.hackathons.map(
    (hackathon, index) => hackathon.title
  )

  const selectChange = (value: string) => {
    const getHackathon = hackathonList.hackathons.filter((hackathon) => {
      return hackathon.title.includes(value)
    })

    const selectedHackathonID = getHackathon.map(
      (hackathon, index) => hackathon.id
    )

    setSelectedHackweek(selectedHackathonID.toString())
  }

  return (
    <>
      <h1>this is the your idea page</h1>
      {hackathonList.isLoadingHackathonList && (
        <div>hackathon select is loading...</div>
      )}
      {!hackathonList.isLoadingHackathonList &&
        !hackathonList.errorHackathonList && (
          <div>
            <div style={{ width: 250 }}>
              <Select
                placeholder={'select a Hackathon'}
                maxDropdownHeight={280}
                data={data}
                onChange={selectChange}
              />
            </div>
            <Accordion mb={30} pt={10} iconPosition="left">
              <Accordion.Item
                style={{ border: '1px solid' }}
                label={'Create new idea'}
              >
                <IdeaForm
                  ideaID={null}
                  hackathon={hackathonData}
                  userId={userId}
                  context={'new'}
                />
              </Accordion.Item>
            </Accordion>
          </div>
        )}

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
          <h2>Your Ideas ({filteredIdeas.length})</h2>

          <div>
            <IdeaCardList ideas={filteredIdeas} columnSize={6} type={'owner'} />
          </div>
        </div>
      )}
    </>
  )
}

export default YourIdeas
