import {
  HackathonPreview,
  Idea,
  IdeaCardType,
  IdeaPreview,
} from '../common/types'
import IdeaCardList from '../components/lists/IdeaCardList'
import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button, Group, Title } from '@mantine/core'
import { getIdeaDetails, getIdeaList } from '../actions/IdeaActions'
import { useMsal } from '@azure/msal-react'
import { UserContext } from './Layout'
import { getListOfHackathons } from '../actions/HackathonActions'

function IdeationPortal() {
  const { instance } = useMsal()
  const user = useContext(UserContext)
  const [allIdeaPreviews, setAllIdeaPreviews] = useState<IdeaPreview[]>([])
  const [ideaData, setIdeaData] = useState<Idea>()
  const [relevantIdeaList, setRelevantIdeaList] = useState<Idea[]>([])
  const [opened, setOpened] = useState(false)
  const [hackathon, setHackathon] = useState<HackathonPreview>()

  const loadHackathons = () => {
    getListOfHackathons(instance).then((data) => {
      const upcomingHackathon = data.find(
        (hackathon) => hackathon.startDate === null
      )
      if (upcomingHackathon) {
        setHackathon(upcomingHackathon)
      }
    })
  }

  const loadHackathonIdeas = () => {
    if (hackathon) {
      getIdeaList(instance, hackathon.id).then((data) => {
        setAllIdeaPreviews(data.ideas)
      })
    }
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
    loadHackathons()
  }, [])

  useEffect(() => {
    loadHackathonIdeas()
  }, [hackathon])

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
      <Title order={1}>Ideation Portal</Title>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title='Whoop whoop!'
      >
        hihi
      </Modal>

      <Group position='center'>
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group>

      {relevantIdeaList.length != null && (
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
