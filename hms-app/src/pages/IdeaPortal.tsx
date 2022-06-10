import React, { useEffect, useState } from 'react'
import { Input, Group, Title, Button, Select } from '@mantine/core'
import { Search } from 'tabler-icons-react'
import IdeaCardList from '../components/lists/IdeaCardList'
import {
  Hackathon,
  Idea,
  HackathonDropdownMode,
  IdeaCardType,
} from '../common/types'
import {
  createHackathonParticipant,
  deleteParticipant,
} from '../actions/ParticipantActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon } from '@modulz/radix-icons'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'

function IdeaPortal() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [participantCheck, setParticipantCheck] = useState(false)
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [buttonIsDisabled, setButtonisDisabled] = useState(false)
  const [relevantIdeaList, setRelevantIdeas] = useState<Idea[]>([])
  const [participantInfo, setParticipantInfo] = useState({
    userId: 'f6fa2b8e-68ed-4486-b8df-f93b87ff23e5',
    hackathonId: '',
    participantId: '',
  })
  const [hackathonData, setHackathonData] = useState({
    id: 'string',
    title: 'string',
    startDate: new Date(),
    endDate: new Date(),
    participants: [],
    categories: undefined,
    ideas: [],
  } as Hackathon)

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredIdeas = relevantIdeaList.filter((item) => {
    return item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const findParticipant = hackathonData.participants?.find(
    (participant) => participant.user.id === participantInfo.userId
  )!

  const addHackathonParticipant = () => {
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: 'Join Hackathon',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })
    createHackathonParticipant(
      participantInfo.userId,
      participantInfo.hackathonId
    ).then((r) => {
      setTimeout(() => {
        console.log('participant added with id', r)
        setButtonisDisabled(false)
        setParticipantCheck(true)
        setParticipantInfo((prevState) => ({
          ...prevState,
          participantId: r.id,
        }))
        updateNotification({
          id: 'participant-load',
          color: 'teal',
          title: 'Joined Hackathon',
          message: 'Notification will close in 2 seconds',
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }, 3000)
    })
  }

  const removeHackathonParticipant = () => {
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: 'Left Hackathon',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })
    deleteParticipant(findParticipant.id).then((r) => {
      console.log('participant deleted with id ', r)
      setButtonisDisabled(false)
      setParticipantCheck(false)
      setTimeout(() => {
        updateNotification({
          id: 'participant-load',
          color: 'teal',
          title: 'Left Hackathon',
          message: 'Notification will close in 2 seconds',
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }, 3000)
    })
  }

  useEffect(() => {
    setParticipantInfo({ ...participantInfo, hackathonId: selectedHackathonId })
  }, [selectedHackathonId])

  useEffect(() => {
    setParticipantCheck(!!findParticipant)
  }, [hackathonData])

  return (
    <>
      <Title order={1}>All ideas</Title>
      <Group position={'apart'} py={20}>
        <HackathonSelectDropdown
          setHackathonId={setSelectedHackathonId}
          context={HackathonDropdownMode.IdeaPortal}
        />

        <Input
          variant="default"
          placeholder="Search for idea title..."
          icon={<Search />}
          onChange={handleChangeSearch}
        />
      </Group>

      <RelevantIdeasLoader
        setHackathon={setHackathonData}
        setRelevantIdeas={setRelevantIdeas}
        selectedHackathonId={selectedHackathonId}
        setLoading={setIsLoading}
      />

      {!isLoading && (
        <Button
          disabled={buttonIsDisabled}
          onClick={
            participantCheck
              ? removeHackathonParticipant
              : addHackathonParticipant
          }
          color={participantCheck ? 'red' : 'blue'}
        >
          {participantCheck ? 'Leave Hackathon' : 'Join Hackathon'}
        </Button>
      )}

      {!isLoading && (
        <div>
          <h2>{hackathonData.title}</h2>
          <h2>
            Start Date: {new Date(hackathonData.startDate).toDateString()} End
            Date: {new Date(hackathonData.endDate).toDateString()}
          </h2>
          <h2>All Ideas ({filteredIdeas.length})</h2>

          <div>
            <IdeaCardList
              ideas={filteredIdeas}
              columnSize={6}
              type={IdeaCardType.IdeaPortal}
              isLoading={false}
            />
          </div>
        </div>
      )}

      {isLoading && selectedHackathonId && <div>Loading...</div>}
    </>
  )
}

export default IdeaPortal
