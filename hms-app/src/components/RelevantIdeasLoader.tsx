import { getHackathonDetails } from '../actions/HackathonActions'
import React, { useEffect, useState } from 'react'
import { Hackathon, Idea } from '../common/types'
import { getIdeaDetails } from '../actions/IdeaActions'
import { useMsal } from '@azure/msal-react'

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
  const { instance } = useMsal()
  const [relevantIdeaList, setRelevantIdeaList] = useState<Idea[]>([])
  const [isThisLoading, setIsThisLoading] = useState(true)
  const [hackathonData, setHackathonData] = useState<Hackathon>({
    id: '',
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    participants: [],
    categories: undefined,
    ideas: [],
  })
  const [ideaData, setIdeaData] = useState<Idea>()

  const loadSelectedHackathon = () => {
    getHackathonDetails(instance, selectedHackathonId).then((data) => {
      setHackathonData(data)
    })
  }

  const loadIdeaDetails = () => {
    hackathonData.ideas!.map((ideaPreview) => {
      getIdeaDetails(instance, ideaPreview.id).then((ideaDetails) => {
        setIdeaData(ideaDetails)
      })
    })
    setIsThisLoading(false)
  }

  useEffect(() => {
    loadSelectedHackathon()
  }, [selectedHackathonId])

  useEffect(() => {
    setRelevantIdeaList(() => {
      return []
    })
    loadIdeaDetails()
    setHackathon(hackathonData)
  }, [hackathonData])

  useEffect(() => {
    if (ideaData)
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
