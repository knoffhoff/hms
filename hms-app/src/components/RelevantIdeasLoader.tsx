import { getHackathonDetails } from '../actions/HackathonActions'
import React, { useEffect, useState } from 'react'
import { Hackathon, Idea } from '../common/types'
import { getIdeaDetails } from '../actions/IdeaActions'
import { useAppSelector } from '../hooks'

type Props = {
  selectedHackathonId: string
  setRelevantIdeas?: (relevantIdeaList: Idea[]) => void
  setHackathon: (hackathonData: Hackathon) => void
  setLoading?: (boolean: boolean) => void
}

export default function RelevantIdeasLoader({
  selectedHackathonId,
  setRelevantIdeas,
  setHackathon,
  setLoading,
}: Props) {
  const [relevantIdeaList, setRelevantIdeaList] = useState<Idea[]>([])
  const [isThisLoading, setIsThisLoading] = useState(true)
  const [hackathonData, setHackathonData] = useState<Hackathon>({
    id: '',
    title: '',
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

  const loadIdeaDetails = () => {
    hackathonData.ideas!.map((ideaPreview) => {
      getIdeaDetails(ideaPreview.id).then((ideaDetails) =>
        setIdeaData(ideaDetails)
      )
    })
    setIsThisLoading(false)
  }

  useEffect(() => {
    loadSelectedHackathon()
  }, [selectedHackathonId])

  useEffect(() => {
    setRelevantIdeaList((relevantIdeaList) => {
      return []
    })
    loadIdeaDetails()
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
    if (setRelevantIdeas) {
      setRelevantIdeas(relevantIdeaList)
    }
  }, [relevantIdeaList])

  useEffect(() => {
    if (setLoading) {
      setLoading(isThisLoading)
    }
  }, [isThisLoading])

  return <div />
}
