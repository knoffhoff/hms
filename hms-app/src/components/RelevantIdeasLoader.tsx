import { getHackathonDetails } from '../actions/HackathonActions'
import React, { useEffect, useState } from 'react'
import { Hackathon, Idea } from '../common/types'
import { getIdeaDetails } from '../actions/IdeaActions'

type Props = {
  selectedHackathonID: string
  setRelevantIdea: (relevantIdeaList: Idea[]) => void
  setHackathon: (hackathonData: Hackathon) => void
  setLoading: (boolean: boolean) => void
}

export default function RelevantIdeasLoader({
  selectedHackathonID,
  setRelevantIdea,
  setHackathon,
  setLoading,
}: Props) {
  const [relevantIdeaList, setRelevantIdeaList] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonData, setHackathonData] = useState<Hackathon>({
    id: 'string',
    title: 'string',
    startDate: new Date(),
    endDate: new Date(),
    participants: [],
    categories: undefined,
    ideas: [],
  })
  const [ideaData, setIdeaData] = useState<Idea>({
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
  })

  const loadSelectedHackathon = () => {
    getHackathonDetails(selectedHackathonID).then((data) => {
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
    localStorage.getItem(selectedHackathonID)
      ? setHackathonData(JSON.parse(localStorage.getItem(selectedHackathonID)!))
      : loadSelectedHackathon()
  }, [selectedHackathonID])

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
