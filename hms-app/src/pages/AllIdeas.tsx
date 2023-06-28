import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  Button,
  Group,
  Modal,
  Text,
  Tooltip,
  Checkbox,
  Title,
  Stack,
  Container,
} from '@mantine/core'
import { ArrowUp } from 'tabler-icons-react'
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
import { NULL_DATE } from '../common/constants'
import HackathonHeader from '../components/HackathonHeader'
import { UserContext } from './Layout'
import IdeaForm from '../components/input-forms/IdeaForm'
import ParticipantManager from '../components/ParticipantManager'
import { JOIN_BUTTON_COLOR } from '../common/colors'
import { getHackathonDetails } from '../actions/HackathonActions'
import { getIdeaDetails } from '../actions/IdeaActions'
import { useMsal } from '@azure/msal-react'
import SearchBar from '../components/searchBar'
import CategorySelector from '../components/CategorySelector'

export const HackathonParticipantContext = createContext('')
export const HackathonVotingContext = createContext(false)

function AllIdeas() {
  const { instance } = useMsal()
  const user = useContext(UserContext)
  const [refreshHackathon, setRefreshHackathon] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isHackathonLoading, setIsHackathonLoading] = useState(true)
  const [participantCheck, setParticipantCheck] = useState(false)
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [relevantIdeaList, setRelevantIdeaList] = useState<Idea[]>([])
  const [userIdeaList, setUserIdeaList] = useState<Idea[]>([])
  const [ideaData, setIdeaData] = useState<Idea>()
  const [isIdeaLoading, setIsIdeaLoading] = useState(true)
  const [showUserIdeas, setShowUserIdeas] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
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

  const loadSelectedHackathon = () => {
    getHackathonDetails(instance, selectedHackathonId).then((data) => {
      setHackathonData(data)
      setIsHackathonLoading(false)
    })
  }

  const loadRelevantIdeaDetails = () => {
    hackathonData.ideas?.map((ideaPreviews) => {
      getIdeaDetails(instance, ideaPreviews.id).then((data) => {
        setIdeaData(data)
        setIsIdeaLoading(false)
      })
    })
  }

  function isHackathonStarted() {
    const today = new Date()
    return hackathonData.startDate <= today
  }

  const closeModal = () => {
    if (hackathonData.id !== undefined) {
      setOpened(false)
    }
    loadSelectedHackathon()
  }

  const categoryFilter = relevantIdeaList.filter((item) => {
    return selectedCategory.length === 0
      ? item
      : selectedCategory.some((category) => item.category?.id === category)
  })

  const searchIdea = categoryFilter.filter((item) => {
    return item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const userIdea = searchIdea.filter((item) => {
    const userId = user?.id
    return item.owner?.id === userId
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
    setRelevantIdeaList([])
    loadSelectedHackathon()
    setIsHackathonLoading(true)
    setRefreshHackathon(false)
  }, [selectedHackathonId, refreshHackathon])

  useEffect(() => {
    setUserIdeaList(userIdea)
  }, [showUserIdeas, searchTerm])

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
    loadRelevantIdeaDetails()
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

  useEffect(() => {
    console.log('selected Category AllIdeas: ', selectedCategory)
  }, [selectedCategory])

  return (
    <>
      <HackathonParticipantContext.Provider
        value={participantInfo.participantId}
      >
        <HackathonVotingContext.Provider value={hackathonData.votingOpened}>
          <HackathonSelectDropdown
            setHackathonId={setSelectedHackathonId}
            context={HackathonDropdownMode.Hackathons}
          />

          {selectedHackathonId === '' && (
            <>
              <ArrowUp size={'70px'} />
              <Text size={'lg'}>Select a hackathon here</Text>
            </>
          )}

          {!isHackathonLoading &&
            hackathonData.startDate !== NULL_DATE &&
            hackathonData.startDate.toString() !== 'Invalid Date' && (
              <>
                <Modal
                  opened={opened}
                  onClose={() => setOpened(false)}
                  size={'70%'}
                  title='Create New Idea!'
                  withCloseButton={false}
                >
                  <IdeaForm
                    ideaId={'null'}
                    hackathon={hackathonData}
                    ownerId={user?.id}
                    context={IdeaFormType.New}
                    onSuccess={closeModal}
                  />
                </Modal>

                <ParticipantManager
                  participantInfo={participantInfo}
                  setParticipantInfo={setParticipantInfo}
                  participantCheck={participantCheck}
                  setParticipantCheck={setParticipantCheck}
                  buttonIsDisabled={buttonIsDisabled}
                  setButtonIsDisabled={setButtonIsDisabled}
                  hackathonData={hackathonData}
                />

                <HackathonHeader hackathonData={hackathonData} />

                <Group position='apart' my={20}>
                  <Stack align='flex-start' justify='flex-start' spacing='sm'>
                    <Title order={2} mt={50}>
                      {showUserIdeas
                        ? 'My submission: ' + userIdeaList.length
                        : 'Ideas submitted: ' + searchIdea.length}
                    </Title>

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
                            sx={{
                              '&[data-disabled]': { pointerEvents: 'all' },
                            }}
                            onClick={(event) => event.preventDefault()}
                          >
                            New Idea
                          </Button>
                        </Tooltip>
                      )}
                      <Checkbox
                        size='md'
                        label={'Show my ideas only'}
                        checked={showUserIdeas}
                        onChange={(event) =>
                          setShowUserIdeas(event.currentTarget.checked)
                        }
                      />
                    </Group>
                  </Stack>

                  <Group position ='right' mt={100}>
                    <CategorySelector
                      hackathonId={selectedHackathonId}
                      onSelectedCategory={setSelectedCategory}
                    />
                    <SearchBar onSearchTermChange={setSearchTerm} />
                  </Group>
                </Group>

                <IdeaCardList
                  ideas={showUserIdeas ? userIdeaList : searchIdea}
                  columnSize={6}
                  type={IdeaCardType.AllIdeas}
                  isLoading={isIdeaLoading}
                  onSuccess={() => setRefreshHackathon(true)}
                  ishackathonStarted={isHackathonStarted()}
                />
              </>
            )}

          {isHackathonLoading && selectedHackathonId && <div>Loading...</div>}
        </HackathonVotingContext.Provider>
      </HackathonParticipantContext.Provider>
    </>
  )
}

export default AllIdeas
