import { getHackathonDetails } from '../actions/HackathonActions'
import { useEffect, useState } from 'react'
import { Hackathon, Idea } from '../common/types'
import { getIdeaDetails } from '../actions/IdeaActions'

type Props = {
  selectedHackweek: string
  setRelevantIdea: (relevantIdeaList: Idea[]) => void
  setHackathon: (hackathonData: Hackathon) => void
}

export default function GetRelevantIdeas({
  selectedHackweek,
  setRelevantIdea,
  setHackathon,
}: Props) {
  const [relevantIdeaList, setRelevantIdeaList] = useState([] as Idea[])
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
    getHackathonDetails(selectedHackweek).then((data) => {
      setHackathonData({
        id: data.id,
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
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
      })
    })
  }

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

  setRelevantIdea(relevantIdeaList)
  setHackathon(hackathonData)

  return <div />
}
