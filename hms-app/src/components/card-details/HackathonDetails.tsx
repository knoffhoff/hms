import React, { useEffect, useState } from 'react'
import {
  deleteHackathon,
  editHackathon,
  getHackathonDetails,
} from '../../actions/HackathonActions'
import IdeaCardList from '../lists/IdeaCardList'
import {
  Hackathon,
  HackathonDetailsType,
  Idea,
  IdeaCardType,
} from '../../common/types'
import { getIdeaDetails } from '../../actions/IdeaActions'
import {
  Accordion,
  Button,
  Card,
  Container,
  Group,
  Modal,
  SimpleGrid,
  Switch,
  Text,
} from '@mantine/core'
import ParticipantDetails from './ParticipantDetails'
import IdeaDetails from './IdeaDetails'
import CategoryForm from '../input-forms/CategoryForm'
import HackathonForm from '../input-forms/HackathonForm'
import CategoryDetails from './CategoryDetails'
import { Link } from 'react-router-dom'
import { styles } from '../../common/styles'
import { NULL_DATE } from '../../common/constants'
import HackathonHeader from '../HackathonHeader'
import { useMsal } from '@azure/msal-react'
import {
  JOIN_BUTTON_COLOR,
  DELETE_BUTTON_COLOR,
  RELOAD_BUTTON_COLOR,
} from '../../common/colors'
import { showNotification, updateNotification } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { RichTextEditor } from '@mantine/rte'

type IProps = {
  hackathonId: string
  type: HackathonDetailsType
}

export default function HackathonDetails(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { hackathonId, type } = props
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [editModalOpened, setEditModalOpened] = useState(false)
  const [isHackathonError, setIsHackathonError] = useState(false)
  const [isHackathonLoading, setIsHackathonLoading] = useState(true)
  const [isIdeaLoading, setIsIdeaLoading] = useState(true)
  const [hackathonData, setHackathonData] = useState({} as Hackathon)
  const [ideaData, setIdeaData] = useState<Idea>()
  const [relevantIdeaList, setRelevantIdeaList] = useState([] as Idea[])
  const [votingOpened, setVotingOpened] = useState<boolean>(false)

  const initialValue =
    '<p>Please add your <b>hackathon description</b> here</p>'
  const [descriptionValue, onChange] = useState(initialValue)

  const loadSelectedHackathon = () => {
    getHackathonDetails(instance, hackathonId).then(
      (data) => {
        setHackathonData(data)
        setVotingOpened(data.votingOpened)
        onChange(data.description || '')
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

  const deleteSelectedHackathon = () => {
    deleteHackathon(instance, hackathonId).then(() => {
      setDeleteModalOpened(false)
    })
  }

  useEffect(() => {
    loadSelectedHackathon()
    setRelevantIdeaList([])
    setIsHackathonLoading(true)
  }, [hackathonId])

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

  const allParticipants = hackathonData.participants?.map(
    (participant, index) => (
      <Accordion.Item value={participant.id} key={participant.id}>
        <Accordion.Control>
          <>
            {index + 1}. {participant.user.firstName}{' '}
            {participant.user.lastName}
          </>
        </Accordion.Control>
        <Accordion.Panel>
          <ParticipantDetails
            participantId={participant.id}
            user={participant.user}
          />
        </Accordion.Panel>
      </Accordion.Item>
    )
  )

  const allCategories = hackathonData.categories?.map((category, index) => (
    <Accordion.Item key={category.id} value={category.id}>
      <Accordion.Control>
        {index + 1}. {category.title}
      </Accordion.Control>
      <Accordion.Panel>
        <CategoryDetails categoryId={category.id.toString()} />
      </Accordion.Panel>
    </Accordion.Item>
  ))

  const allIdeas = relevantIdeaList.map((idea, index) => (
    <Accordion.Item key={idea.id} value={idea.id}>
      <Accordion.Control>
        {index + 1}. {idea.title}
      </Accordion.Control>
      <Accordion.Panel>
        <IdeaDetails
          idea={idea}
          type={IdeaCardType.Admin}
          isLoading={isIdeaLoading}
        />
      </Accordion.Panel>
    </Accordion.Item>
  ))

  function refreshList() {
    setIsHackathonLoading(true)
    loadSelectedHackathon()
  }

  const deleteModal = (
    <Modal
      centered
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.text}>
        Are you sure you want to delete this hackathon?
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
        style={{ backgroundColor: DELETE_BUTTON_COLOR }}
        onClick={() => deleteSelectedHackathon()}
      >
        Yes delete this hackathon
      </Button>
      <Text className={classes.text}>
        (This window will automatically closed as soon as the hackathon is
        deleted)
      </Text>
    </Modal>
  )

  const editModal = (
    <Modal
      centered
      size='55%'
      opened={editModalOpened}
      onClose={() => setEditModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.title}>Edit Hackathon</Text>
      <HackathonForm context={'edit'} hackathonId={hackathonData.id} />
      {isHackathonLoading && <div>Loading...</div>}
      <Text className={classes.text}>
        (This window will automatically closed as soon as the hackathon is
        changed)
      </Text>
    </Modal>
  )

  const statusToggles = (
    <>
      <Group>
        <Text className={classes.text}>Voting opened: </Text>
        <Switch
          checked={votingOpened}
          onChange={(event) => editThisHackathon(event.currentTarget.checked)}
        />
      </Group>
    </>
  )

  function editThisHackathon(event: boolean) {
    showNotification({
      id: 'hackathon-load',
      loading: true,
      title: `Editing ${hackathonData.title}`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    editHackathon(
      instance,
      hackathonId!,
      hackathonData.title,
      hackathonData.description!,
      hackathonData.slug,
      hackathonData.startDate!,
      hackathonData.endDate!,
      event
    ).then((response) => {
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'hackathon-load',
          color: 'red',
          title: 'Failed to edit hackathon',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        setVotingOpened(event)
        updateNotification({
          id: 'hackathon-load',
          color: 'teal',
          title: `Edited ${hackathonData.title}`,
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
      }
    })
  }

  return (
    <>
      {isHackathonError && (
        <div>
          <Text className={classes.title}>Error loading hackathons</Text>
          <Text className={classes.text}>something went wrong.</Text>
        </div>
      )}
      {isHackathonLoading && (
        <div>
          <Text className={classes.text}>Hackathon details are loading...</Text>
        </div>
      )}

      {hackathonData.startDate !== NULL_DATE &&
        hackathonData.startDate?.toString() !== 'Invalid Date' &&
        !isHackathonLoading &&
        !isHackathonError &&
        (type === HackathonDetailsType.Header ||
          type === HackathonDetailsType.Archive) && (
          <div>
            <HackathonHeader hackathonData={hackathonData} />

            {type === HackathonDetailsType.Archive && hackathonId !== '' && (
              <Container mb={25}>
                <RichTextEditor
                  readOnly
                  value={hackathonData.description || ''}
                  onChange={onChange}
                  id='rte'
                />
              </Container>
            )}

            <IdeaCardList
              ideas={relevantIdeaList}
              columnSize={6}
              type={IdeaCardType.Archive}
              isLoading={isIdeaLoading}
            />
          </div>
        )}

      {hackathonData.startDate !== NULL_DATE &&
        hackathonData.startDate?.toString() !== 'Invalid Date' &&
        !isHackathonLoading &&
        !isHackathonError &&
        type === HackathonDetailsType.FullInfo && (
          <Card withBorder className={classes.card}>
            <Card.Section className={classes.borderSection}>
              <Text className={classes.title}>{hackathonData.title}</Text>
              <Text className={classes.text}>ID: {hackathonData.id}</Text>
              <Text className={classes.text}>Slug: {hackathonData.slug}</Text>
            </Card.Section>

            <Card.Section className={classes.borderSection}>
              <Text className={classes.title}>Set Hackathon Status</Text>
              {statusToggles}
            </Card.Section>

            <Card.Section className={classes.borderSection}>
              <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                <Card.Section>
                  <Text className={classes.title}>
                    Start Date:{' '}
                    {new Date(hackathonData.startDate).toDateString()}
                  </Text>
                </Card.Section>
                <Card.Section>
                  <Text className={classes.title}>
                    End Date: {new Date(hackathonData.endDate).toDateString()}
                  </Text>
                </Card.Section>
              </SimpleGrid>
            </Card.Section>

            <Card.Section className={classes.borderSection}>
              <Text className={classes.title}>Description:</Text>
              <RichTextEditor
                readOnly
                value={hackathonData.description || ''}
                onChange={onChange}
                id='rte'
              />
            </Card.Section>

            <Accordion chevronPosition={'left'}>
              <Accordion.Item value={'categories'}>
                <Accordion.Control>
                  <Text className={classes.label}>
                    Categories ( {allCategories?.length} )
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Accordion chevronPosition={'right'}>
                    <Accordion.Item
                      className={classes.borderAccordion}
                      value={'add-category'}
                    >
                      <Accordion.Control>Add Category</Accordion.Control>
                      <Accordion.Panel>
                        <CategoryForm
                          hackathonId={hackathonData.id}
                          context={'new'}
                          categoryId={''}
                        />
                      </Accordion.Panel>
                    </Accordion.Item>
                    {allCategories}
                  </Accordion>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Accordion chevronPosition={'left'}>
              <Accordion.Item value={'participants'}>
                <Accordion.Control>
                  <Text className={classes.label}>
                    Participants ( {allParticipants?.length} )
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Accordion chevronPosition={'right'}>
                    {allParticipants}
                  </Accordion>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Accordion chevronPosition={'left'}>
              <Accordion.Item value={'ideas'}>
                <Accordion.Control>
                  <Text className={classes.label}>
                    Ideas ( {allIdeas?.length} )
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Button
                    style={{ backgroundColor: JOIN_BUTTON_COLOR }}
                    mb={20}
                    onClick={() =>
                      localStorage.setItem(
                        'ideas',
                        JSON.stringify(relevantIdeaList)
                      )
                    }
                    component={Link}
                    to='/presentations'
                  >
                    Presentations
                  </Button>
                  <Accordion chevronPosition={'right'}>{allIdeas}</Accordion>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

            <Card.Section className={classes.borderSection}>
              <Group position='left' mt='xl'>
                {deleteModal}
                <Button
                  style={{ backgroundColor: DELETE_BUTTON_COLOR }}
                  onClick={() => setDeleteModalOpened(true)}
                >
                  Delete
                </Button>
                {editModal}
                <Button
                  style={{ backgroundColor: JOIN_BUTTON_COLOR }}
                  onClick={() => setEditModalOpened(true)}
                >
                  Edit
                </Button>
                {!isHackathonLoading && (
                  <Button
                    style={{ backgroundColor: RELOAD_BUTTON_COLOR }}
                    onClick={() => refreshList()}
                  >
                    Reload
                  </Button>
                )}
                {isHackathonLoading && <div>Loading...</div>}
              </Group>
            </Card.Section>
          </Card>
        )}
    </>
  )
}
