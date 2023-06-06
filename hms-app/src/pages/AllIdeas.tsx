import React, { createContext, useContext, useEffect, useState } from 'react'
import { Button, Group, Input, Modal, Text, Tooltip } from '@mantine/core'
import { ArrowUp, Check, Search, X } from 'tabler-icons-react'
import IdeaCardList from '../components/lists/IdeaCardList'
import {
  Hackathon,
  HackathonDropdownMode,
  Idea,
  IdeaCardType,
  IdeaFormType,
  ParticipantPreview,
} from '../common/types'
import {
  createHackathonParticipant,
  deleteParticipant,
} from '../actions/ParticipantActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'
import { NULL_DATE } from '../common/constants'
import HackathonHeader from '../components/HackathonHeader'
import { useMsal } from '@azure/msal-react'
import {
  DISABLED_BUTTON_COLOR,
  JOIN_BUTTON_COLOR,
  LEAVE_BUTTON_COLOR,
} from '../common/colors'
import { UserContext } from './Layout'
import { styles } from '../common/styles'
import IdeaForm from '../components/input-forms/IdeaForm'

export const HackathonParticipantContext = createContext('')
export const HackathonVotingContext = createContext(false)

function AllIdeas() {
  const { instance } = useMsal()
  const { classes } = styles()
  const user = useContext(UserContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [participantCheck, setParticipantCheck] = useState(false)
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false)
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
  const [removeParticipantModalOpened, setRemoveParticipantModalOpened] =
    useState(false)
  const [opened, setOpened] = useState(false)

  const closeModal = () => {
    if (hackathonData.id !== undefined) {
      setOpened(false)
    }
    reloadHackathon()
  }

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

  const filteredIdeas = relevantIdeaList.filter((item) => {
    return item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const reloadHackathon = () => {
    const id = selectedHackathonId
    setSelectedHackathonId('')
    setSelectedHackathonId(id)
  }

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
    setButtonIsDisabled(true)
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
      setButtonIsDisabled(false)
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
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        setParticipantCheck(true)
        updateNotification({
          id: 'participant-load',
          color: 'teal',
          title: 'Joined Hackathon',
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
      }
    })
  }

  const removeHackathonParticipant = () => {
    setButtonIsDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: 'Leave Hackathon',
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    deleteParticipant(instance, findParticipant().id).then((response) => {
      setButtonIsDisabled(false)
      if (JSON.stringify(response).toString().includes('error')) {
        setParticipantCheck(true)
        updateNotification({
          id: 'participant-load',
          color: 'red',
          title: 'Failed to leave Hackathon',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        setParticipantCheck(false)
        updateNotification({
          id: 'participant-load',
          color: 'teal',
          title: 'Left Hackathon',
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
      }
    })
  }

  const removeParticipantModal = (
    <Modal
      centered
      opened={removeParticipantModalOpened}
      onClose={() => setRemoveParticipantModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.text}>
        Are you sure you want to leave this hackathon? All your progress and
        ideas will be lost!
      </Text>
      <Text className={classes.title}>Title: {hackathonData.title}</Text>
      <Text className={classes.title}>
        Start Date:
        {new Date(hackathonData.startDate).toDateString()}
      </Text>
      <Text className={classes.title}>
        End Date:
        {new Date(hackathonData.endDate).toDateString()}
      </Text>
      <Button
        style={{ backgroundColor: LEAVE_BUTTON_COLOR }}
        onClick={() => removeHackathonParticipant()}
      >
        Yes, leave hackathon
      </Button>
    </Modal>
  )

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
        <HackathonVotingContext.Provider value={hackathonData.votingOpened}>
          {removeParticipantModal}

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
                <Modal
                  opened={opened}
                  onClose={() => setOpened(false)}
                  size={'70%'}
                  withCloseButton={false}
                >
                  <Text className={classes.title}>Create New Idea</Text>
                  <IdeaForm
                    ideaId={'null'}
                    hackathon={hackathonData}
                    ownerId={user?.id}
                    context={IdeaFormType.New}
                    onSuccess={closeModal}
                  />
                </Modal>
                {participantCheck ? (
                  <Button
                    onClick={() => setOpened(true)}
                    style={{
                      backgroundColor: JOIN_BUTTON_COLOR,
                    }}
                  >
                    New Idea
                  </Button>
                ) : (
                  <Tooltip
                    label='You must join the hackathon to create a new idea'
                    color='orange'
                    withArrow
                    arrowPosition='center'
                  >
                    <Button
                      variant='default'
                      data-disabled
                      sx={{ '&[data-disabled]': { pointerEvents: 'all' } }}
                      onClick={(event) => event.preventDefault()}
                    >
                      New Idea
                    </Button>
                  </Tooltip>
                )}

                <Button
                  ml={10}
                  disabled={buttonIsDisabled}
                  onClick={
                    participantCheck
                      ? () => setRemoveParticipantModalOpened(true)
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
                  type={IdeaCardType.AllIdeas}
                  isLoading={isLoading}
                  onSuccess={reloadHackathon}
                />
              </>
            )}

          {isLoading && selectedHackathonId && <div>Loading...</div>}
        </HackathonVotingContext.Provider>
      </HackathonParticipantContext.Provider>
    </>
  )
}

export default AllIdeas
