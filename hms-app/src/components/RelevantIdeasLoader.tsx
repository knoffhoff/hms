import { getHackathonDetails } from '../actions/HackathonActions'
import React, { useEffect, useState } from 'react'
import { Hackathon, Idea } from '../common/types'
import { getIdeaDetails } from '../actions/IdeaActions'

type Props = {
  selectedHackweekID: string
  setRelevantIdea: (relevantIdeaList: Idea[]) => void
  setHackathon: (hackathonData: Hackathon) => void
  setLoading: (boolean: boolean) => void
}

export default function RelevantIdeasLoader({
  selectedHackweekID,
  setRelevantIdea,
  setHackathon,
  setLoading,
}: Props) {
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

  const loadSelectedHackathonData = () => {
    getHackathonDetails(selectedHackweekID).then((data) => {
      setHackathonData({
        id: data.id,
        title: data.title,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        participants: data.participants,
        categories: data.categories,
        ideas: data.ideas,
      })
    })
  }

  const loadRelevantIdeaDetails = () => {
    hackathonData.ideas?.map((ideaPreviews) => {
      getIdeaDetails(ideaPreviews.id).then((data) => {
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
        setIsLoading(false)
      })
    })
  }

  useEffect(() => {
    loadSelectedHackathonData()
  }, [selectedHackweekID])

  useEffect(() => {
    setRelevantIdeaList((relevantIdeaList) => {
      return []
    })
    loadRelevantIdeaDetails()
    setHackathon(hackathonData)
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

  useEffect(() => {
    setRelevantIdea(relevantIdeaList)
  }, [relevantIdeaList])

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading])

  return <div />
}
