import { getHackathonDetails } from '../actions/HackathonActions'
import React, { useEffect, useState } from 'react'
import { Hackathon, Idea } from '../common/types'
import { getIdeaDetails } from '../actions/IdeaActions'

type Props = {
  selectedHackathonId: string
  setRelevantIdea: (relevantIdeaList: Idea[]) => void
  setHackathon: (hackathonData: Hackathon) => void
  setLoading: (boolean: boolean) => void
}

export default function RelevantIdeasLoader({
  selectedHackathonId,
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
    getHackathonDetails(selectedHackathonId).then((data) => {
      setHackathonData(data)
    })
  }

  const loadRelevantIdeaDetails = () => {
    hackathonData.ideas?.map((ideaPreviews) => {
      getIdeaDetails(ideaPreviews.id).then((data) => {
        setIdeaData(data)
        setIsLoading(false)
      })
    })
  }

  useEffect(() => {
    localStorage.getItem(selectedHackathonId)
      ? setHackathonData(JSON.parse(localStorage.getItem(selectedHackathonId)!))
      : loadSelectedHackathon()
  }, [selectedHackathonId])

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
