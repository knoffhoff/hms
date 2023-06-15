import React, { createContext, useContext, useEffect, useState } from 'react'
import { Button, Group, Input, Modal, Text, Tooltip } from '@mantine/core'
import { ArrowUp, Search } from 'tabler-icons-react'
import IdeaCardList from '../components/lists/IdeaCardList'
import {
  Hackathon,
  HackathonDropdownMode,
  Idea,
  IdeaCardType,
  IdeaFormType,
  ParticipantPreview,
} from '../common/types'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'
import { NULL_DATE } from '../common/constants'
import HackathonHeader from '../components/HackathonHeader'
import { UserContext } from './Layout'
import { styles } from '../common/styles'
import IdeaForm from '../components/input-forms/IdeaForm'
import ParticipantManager from '../components/ParticipantManager'
import { JOIN_BUTTON_COLOR } from '../common/colors'

export const HackathonParticipantContext = createContext('')
export const HackathonVotingContext = createContext(false)

function AllIdeas() {
  const { classes } = styles()
  const user = useContext(UserContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [participantCheck, setParticipantCheck] = useState(false)
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
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
  const [opened, setOpened] = useState(false)
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false)

  function isHackathonStarted() {
    const today = new Date()
    return hackathonData.startDate <= today
  }

  const closeModal = () => {
    if (hackathonData.id !== undefined) {
      setOpened(false)
    }
    reloadHackathon()
  }

  const reloadHackathon = () => {
    const id = selectedHackathonId
    setSelectedHackathonId('')
    setSelectedHackathonId(id)
  }

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredIdeas = relevantIdeaList.filter((item) => {
    return item.title?.toLowerCase().includes(searchTerm.toLowerCase())
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

  useEffect(() => {
    const participant = findParticipant()
    setParticipantCheck(!!participant)
    if (participant)
      setParticipantInfo({ ...participantInfo, participantId: participant.id })
  }, [hackathonData])

  useEffect(() => {
    if (user) {
      setParticipantInfo({
        userId: user.id,
        hackathonId: selectedHackathonId,
        participantId: participantInfo.participantId,
      })
    }
  }, [user, selectedHackathonId])

  return (
    <>
      <HackathonParticipantContext.Provider
        value={participantInfo.participantId}
      >
        <HackathonVotingContext.Provider value={hackathonData.votingOpened}>
          <Group position={'apart'} my={20}>
            <HackathonSelectDropdown
              setHackathonId={setSelectedHackathonId}
              context={HackathonDropdownMode.Hackathons}
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

                <Group>
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

                  <ParticipantManager
                    participantInfo={participantInfo}
                    setParticipantInfo={setParticipantInfo}
                    participantCheck={participantCheck}
                    setParticipantCheck={setParticipantCheck}
                    buttonIsDisabled={buttonIsDisabled}
                    setButtonIsDisabled={setButtonIsDisabled}
                    hackathonData={hackathonData}
                  />
                </Group>

                <HackathonHeader hackathonData={hackathonData} />

                <IdeaCardList
                  ideas={filteredIdeas}
                  columnSize={6}
                  type={IdeaCardType.AllIdeas}
                  isLoading={isLoading}
                  onSuccess={reloadHackathon}
                  ishackathonStarted={isHackathonStarted()}
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
