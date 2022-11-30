import { Idea, IdeaCardType, IdeaPreview } from '../common/types'
import IdeaCardList from '../components/lists/IdeaCardList'
import React, { useEffect, useState } from 'react'
import { Title } from '@mantine/core'
import { getAllIdeas, getIdeaDetails } from '../actions/IdeaActions'
import { useMsal } from '@azure/msal-react'

function IdeationPortal() {
  const { instance } = useMsal()
  const [allIdeaPreviews, setAllIdeaPreviews] = useState<IdeaPreview[]>([])
  const [ideaData, setIdeaData] = useState<Idea>()
  const [relevantIdeaList, setRelevantIdeaList] = useState<Idea[]>([])

  const loadAllIdeas = () => {
    getAllIdeas(instance).then((data) => {
      setAllIdeaPreviews(data.ideas)
    })
  }

  const loadIdeaDetails = () => {
    if (allIdeaPreviews.length > 0) {
      allIdeaPreviews.map((ideaPreview) => {
        getIdeaDetails(instance, ideaPreview.id).then((ideaDetails) => {
          setIdeaData(ideaDetails)
        })
      })
    }
  }

  useEffect(() => {
    loadAllIdeas()
  }, [])

  useEffect(() => {
    loadIdeaDetails()
  }, [allIdeaPreviews])

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

  return (
    <>
      {relevantIdeaList.length > 0 && (
        <div>
          <Title order={2} mt={50} mb={30}>
            submitted ideas: {relevantIdeaList.length}
          </Title>
          <IdeaCardList
            ideas={relevantIdeaList}
            columnSize={6}
            type={IdeaCardType.IdeaPortal}
            isLoading={false}
          />
        </div>
      )}
    </>
  )
}

export default IdeationPortal
