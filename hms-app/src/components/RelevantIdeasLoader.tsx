import { getHackathonDetails } from '../actions/HackathonActions'
import React, { useEffect, useState } from 'react'
import { Hackathon, Idea } from '../common/types'
import { getIdeaDetails } from '../actions/IdeaActions'

type Props = {
  selectedHackathonId: string
  setRelevantIdeas: (relevantIdeaList: Idea[]) => void
  setHackathon: (hackathonData: Hackathon) => void
  setLoading: (boolean: boolean) => void
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
    selectedHackathonId !== ''
      ? getHackathonDetails(selectedHackathonId).then((data) => {
          setHackathonData(data)
        })
      : console.log('id was empty')
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
    localStorage.getItem(selectedHackathonId)
      ? setHackathonData(JSON.parse(localStorage.getItem(selectedHackathonId)!))
      : loadSelectedHackathon()
  }, [selectedHackathonId])

  useEffect(() => {
    localStorage.getItem(selectedHackathonId)
      ? console.log(
          'id exist',
          JSON.parse(localStorage.getItem(hackathonData.id)!)
        )
      : localStorage.setItem(hackathonData.id, JSON.stringify(hackathonData))
  }, [hackathonData])

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
    setRelevantIdeas(relevantIdeaList)
  }, [relevantIdeaList])

  useEffect(() => {
    setLoading(isThisLoading)
  }, [isThisLoading])

  return <div />
}
