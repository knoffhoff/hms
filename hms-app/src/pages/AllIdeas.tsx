import React, { useEffect, useState, useContext, createContext } from 'react'
import { Input, Group, Text, Button } from '@mantine/core'
import { ArrowBigUpLine, ArrowUp, Search } from 'tabler-icons-react'
import IdeaCardList from '../components/lists/IdeaCardList'
import {
  Hackathon,
  Idea,
  HackathonDropdownMode,
  IdeaCardType,
  ParticipantPreview,
  UserPreview,
} from '../common/types'
import {
  createHackathonParticipant,
  deleteParticipant,
} from '../actions/ParticipantActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon, Cross2Icon } from '@modulz/radix-icons'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'
import { NULL_DATE } from '../common/constants'
import HackathonHeader from '../components/HackathonHeader'
import { useMsal } from '@azure/msal-react'
import { JOIN_BUTTON_COLOR, LEAVE_BUTTON_COLOR } from '../common/colors'
import { UserContext } from './Layout'

export const HackathonParticipantContext = createContext('')

function AllIdeas() {
  const { instance } = useMsal()
  const user = useContext(UserContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [participantCheck, setParticipantCheck] = useState(false)
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [buttonIsDisabled, setButtonisDisabled] = useState(false)
  const [relevantIdeaList, setRelevantIdeas] = useState<Idea[]>([])
  const [participantInfo, setParticipantInfo] = useState({
    userId: '',
    hackathonId: '',
    participantId: '',
  })
  const [hackathonData, setHackathonData] = useState({
    id: '',
    title: '',
    startDate: NULL_DATE,
    endDate: NULL_DATE,
  } as Hackathon)

  useEffect(() => {
    if (user) {
      setParticipantInfo({
        userId: user.id,
        hackathonId: selectedHackathonId,
        participantId: participantInfo.participantId,
      })
    }
  }, [user, selectedHackathonId])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredIdeas = relevantIdeaList
    .filter((item) => {
      return item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    })
    .sort((a, b) => {
      return a.creationDate < b.creationDate ? -1 : 1
    })

  const findParticipant = () => {
    let participant: ParticipantPreview
    if (hackathonData.participants) {
      participant = hackathonData.participants.find(
        (p) => p.user.id === participantInfo.userId
      )!
    } else {
      participant = {
        id: '',
        user: {
          id: '',
        },
      } as ParticipantPreview
    }
    return participant
  }

  const addHackathonParticipant = () => {
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: 'Join Hackathon',
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    createHackathonParticipant(
      instance,
      participantInfo.userId,
      participantInfo.hackathonId
    ).then((response) => {
      setButtonisDisabled(false)
      setParticipantInfo((prevState) => ({
        ...prevState,
        participantId: response.id,
      }))
      if (JSON.stringify(response).toString().includes('error')) {
        setParticipantCheck(false)
        updateNotification({
          id: 'participant-load',
          color: 'red',
          title: 'Failed to join Hackathon',
          message: undefined,
          icon: <Cross2Icon />,
          autoClose: 2000,
        })
      } else {
        setParticipantCheck(true)
        updateNotification({
          id: 'participant-load',
          color: 'teal',
          title: 'Joined Hackathon',
          message: undefined,
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }
    })
  }

  const removeHackathonParticipant = () => {
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: 'Leave Hackathon',
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    deleteParticipant(instance, findParticipant().id).then((response) => {
      setButtonisDisabled(false)
      if (JSON.stringify(response).toString().includes('error')) {
        setParticipantCheck(true)
        updateNotification({
          id: 'participant-load',
          color: 'red',
          title: 'Failed to leave Hackathon',
          message: undefined,
          icon: <Cross2Icon />,
          autoClose: 2000,
        })
      } else {
        setParticipantCheck(false)
        updateNotification({
          id: 'participant-load',
          color: 'teal',
          title: 'Left Hackathon',
          message: undefined,
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }
    })
  }

  useEffect(() => {
    const participant = findParticipant()
    setParticipantCheck(!!participant)
    if (participant)
      setParticipantInfo({ ...participantInfo, participantId: participant.id })
  }, [hackathonData])

  return (
    <>
      <HackathonParticipantContext.Provider
        value={participantInfo.participantId}
      >
        <Group position={'apart'} my={20}>
          <HackathonSelectDropdown
            setHackathonId={setSelectedHackathonId}
            context={HackathonDropdownMode.IdeaPortal}
          />

          <Input
            variant='default'
            placeholder='Search for idea title...'
            icon={<Search />}
            onChange={handleChangeSearch}
          />
        </Group>

        {selectedHackathonId === '' && (
          <>
            <ArrowUp size={'70px'} />
            <Text size={'lg'}>Select a hackathon here</Text>
          </>
        )}

        <RelevantIdeasLoader
          setHackathon={setHackathonData}
          setRelevantIdeas={setRelevantIdeas}
          selectedHackathonId={selectedHackathonId}
          setLoading={setIsLoading}
        />

        {!isLoading &&
          hackathonData.startDate !== NULL_DATE &&
          hackathonData.startDate.toString() !== 'Invalid Date' && (
            <>
              <Button
                disabled={buttonIsDisabled}
                onClick={
                  participantCheck
                    ? removeHackathonParticipant
                    : addHackathonParticipant
                }
                style={{
                  backgroundColor: participantCheck
                    ? LEAVE_BUTTON_COLOR
                    : JOIN_BUTTON_COLOR,
                }}
              >
                {participantCheck ? 'Leave Hackathon' : 'Join Hackathon'}
              </Button>

              <HackathonHeader hackathonData={hackathonData} />

              <IdeaCardList
                ideas={filteredIdeas}
                columnSize={6}
                type={IdeaCardType.IdeaPortal}
                isLoading={isLoading}
              />
            </>
          )}

        {isLoading && selectedHackathonId && <div>Loading...</div>}
      </HackathonParticipantContext.Provider>
    </>
  )
}

export default AllIdeas
