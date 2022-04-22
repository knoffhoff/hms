import React, { useEffect, useState } from 'react'
import { getHackathonDetails, getIdeaDetails } from '../actions/GetBackendData'
import IdeaCardList from './IdeaCardList'
import { Hackathon, Idea } from '../common/types'

type IProps = {
  hackathonID: string
}

export default function HackathonDetails(props: IProps) {
  const { hackathonID } = props
  const [hackathonData, setHackathonData] = useState({
    errorHackathonData: false,
    isLoadingHackathonData: true,
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

  const loadSelectedHackathon = () => {
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
    loadSelectedHackathon()
    setRelevantIdeaList([])
    setHackathonData({
      ...hackathonData,
      isLoadingHackathonData: true,
    })
    console.log('hackathonData', hackathonData)
  }, [hackathonID])

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

  return (
    <>
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

      {hackathonData.startDate && !hackathonData.isLoadingHackathonData && (
        <div>
          <h2>Title: {hackathonData.title}</h2>
          <h2>
            Date from: {new Date(hackathonData.startDate).toDateString()} to:{' '}
            {new Date(hackathonData.endDate).toDateString()}
          </h2>
          <h2>All Ideas ({hackathonData.ideas?.length})</h2>

          <IdeaCardList
            ideas={relevantIdeaList}
            columnSize={6}
            type={'Archive'}
          />
        </div>
      )}
    </>
  )
}
