import { Accordion, Group, Text, Title, Alert, Center } from '@mantine/core'
import {
  Hackathon,
  HackathonDropdownMode,
  Idea,
  IdeaCardType,
  IdeaFormType,
} from '../common/types'
import IdeaCardList from '../components/lists/IdeaCardList'
import React, { useEffect, useState, useContext } from 'react'
import IdeaForm from '../components/input-forms/IdeaForm'
import { styles } from '../common/styles'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import { NULL_DATE } from '../common/constants'
import HackathonHeader from '../components/HackathonHeader'
import { ArrowUp, AlertCircle } from 'tabler-icons-react'
import { UserContext } from './Layout'
import { getIdeaDetails } from '../actions/IdeaActions'
import { useMsal } from '@azure/msal-react'
import { getHackathonDetails } from '../actions/HackathonActions'

export default function MyIdeas() {
  const { instance } = useMsal()
  const { classes } = styles()
  const user = useContext(UserContext)
  const [participantId, setParticipantId] = useState('')
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [relevantIdeas, setRelevantIdeas] = useState<Idea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonData, setHackathonData] = useState<Hackathon>({
    id: 'string',
    title: 'string',
    description: 'string',
    slug: 'string',
    startDate: NULL_DATE,
    endDate: NULL_DATE,
    participants: [],
    categories: undefined,
    ideas: [],
    votingOpened: false,
  } as Hackathon)
  const today = new Date()
  const [ideaData, setIdeaData] = useState<Idea>()

  const loadSelectedHackathon = () => {
    if (selectedHackathonId !== '') {
      getHackathonDetails(instance, selectedHackathonId).then((data) => {
        setHackathonData(data)
      })
      setIsLoading(false)
    }
  }

  const loadIdeaDetails = () => {
    hackathonData.ideas!.map((ideaPreview) => {
      getIdeaDetails(instance, ideaPreview.id).then((ideaDetails) => {
        setIdeaData(ideaDetails)
      })
    })
  }

  const filteredIdeas = relevantIdeas.filter((item) => {
    const userId = user?.id || ''
    return item.owner?.id.includes(userId)
  })

  const userParticipant = () => {
    const userId = user?.id || ''
    if (hackathonData && hackathonData.participants) {
      return hackathonData.participants.find(
        (participant) => participant.user.id === userId
      )
    } else return undefined
  }

  function isParticipant(): boolean {
    return participantId !== undefined && participantId !== ''
  }

  useEffect(() => {
    loadSelectedHackathon()
  }, [selectedHackathonId])

  useEffect(() => {
    if (ideaData)
      if (
        !relevantIdeas
          .map((relevant) => {
            return relevant.id
          })
          .includes(ideaData.id)
      ) {
        setRelevantIdeas((relevantIdeas) => {
          return [...relevantIdeas, ideaData]
        })
      }
  }, [ideaData])

  useEffect(() => {
    const participant = userParticipant()
    if (participant) setParticipantId(participant.id)
    loadIdeaDetails()
  }, [hackathonData])

  return (
    <>
      <Group position={'apart'} my={20}>
        <HackathonSelectDropdown
          setHackathonId={setSelectedHackathonId}
          context={HackathonDropdownMode.MyIdeas}
        />
      </Group>

      {selectedHackathonId === '' && (
        <>
          <ArrowUp size={'70px'} />
          <Text size={'lg'}>Select a hackathon here</Text>
        </>
      )}

      {!isLoading &&
        hackathonData.startDate !== NULL_DATE &&
        hackathonData.startDate.toString() !== 'Invalid Date' && (
          <>
            <HackathonHeader hackathonData={hackathonData} />

            {isParticipant() && (
              <>
                {!(hackathonData.endDate < today) && (
                  <Accordion>
                    <Accordion.Item
                      value={'createNewIdea'}
                      className={classes.borderAccordion}
                    >
                      <Accordion.Control>Create new idea</Accordion.Control>
                      <Accordion.Panel>
                        <IdeaForm
                          ideaId={'null'}
                          hackathon={hackathonData}
                          ownerId={user?.id}
                          context={IdeaFormType.New}
                          reload={loadSelectedHackathon}
                        />
                      </Accordion.Panel>
                    </Accordion.Item>
                  </Accordion>
                )}
                {filteredIdeas.length > 0 && (
                  <Title order={2} mt={50} mb={30}>
                    You have submitted {filteredIdeas.length} ideas:
                  </Title>
                )}
                <IdeaCardList
                  ideas={filteredIdeas}
                  columnSize={6}
                  type={IdeaCardType.Owner}
                  isLoading={false}
                />
              </>
            )}
            {!isParticipant() && (
              <Center>
                <Alert
                  icon={<AlertCircle size={16} />}
                  title='Not a participant!'
                  color='red'
                  style={{ maxWidth: '500px' }}
                >
                  You are not yet participating in this hackathon. Go to
                  &quot;All ideas&quot; and select the hackathon you want to
                  participate in. Then click on &quot;Participate&quot; to join
                  the hackathon.
                </Alert>
              </Center>
            )}
          </>
        )}
      {isLoading && selectedHackathonId && <div>Loading...</div>}
    </>
  )
}
