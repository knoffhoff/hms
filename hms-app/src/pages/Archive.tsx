import React, { useEffect, useState } from 'react'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import { Group, Text } from '@mantine/core'
import { Hackathon, HackathonDropdownMode, Idea, IdeaCardType } from '../common/types'
import { ArrowUp } from 'tabler-icons-react'
import { NULL_DATE } from '../common/constants'
import { getHackathonDetails } from '../actions/HackathonActions'
import { useMsal } from '@azure/msal-react'
import HackathonHeader from '../components/HackathonHeader'
import IdeaCardList from '../components/lists/IdeaCardList'
import { getIdeaDetails } from '../actions/IdeaActions'

export default function Archive() {
  const { instance } = useMsal()
  const [hackathonData, setHackathonData] = useState({} as Hackathon)
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [isHackathonError, setIsHackathonError] = useState(false)
  const [isHackathonLoading, setIsHackathonLoading] = useState(true)
  const [isIdeaLoading, setIsIdeaLoading] = useState(true)
  const [ideaData, setIdeaData] = useState<Idea>()
  const [relevantIdeaList, setRelevantIdeaList] = useState([] as Idea[])

  const loadSelectedHackathon = () => {
    getHackathonDetails(instance, selectedHackathonId).then(
      (data) => {
        setHackathonData(data)
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
      getIdeaDetails(instance, ideaPreviews.id).then((data) => {
        setIdeaData(data)
        setIsIdeaLoading(false)
      })
    })
  }

  useEffect(() => {
    loadSelectedHackathon()
    setRelevantIdeaList([])
    setIsHackathonLoading(true)
  }, [selectedHackathonId])

  useEffect(() => {
  loadRelevantIdeaDetails()
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

  return (
    <>
      <Group position={'apart'} my={20}>
        <HackathonSelectDropdown
          setHackathonId={setSelectedHackathonId}
          context={HackathonDropdownMode.Archive}
        />
      </Group>

      {selectedHackathonId === '' && (
        <>
          <ArrowUp size={'70px'} />
          <Text size={'lg'}>Select a hackathon here</Text>
        </>
      )}

      {hackathonData.startDate !== NULL_DATE &&
        hackathonData.startDate?.toString() !== 'Invalid Date' &&
        !isHackathonLoading &&
        !isHackathonError && (
          <div>
            <HackathonHeader hackathonData={hackathonData} />

            <IdeaCardList
              ideas={relevantIdeaList}
              columnSize={6}
              type={IdeaCardType.Archive}
              isLoading={isIdeaLoading}
            />
          </div>
        )}
    </>
  )
}
