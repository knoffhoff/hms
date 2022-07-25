import React, { useEffect, useState } from 'react'
import {
  deleteHackathon,
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
import { RichTextEditor } from '@mantine/rte'
import { NULL_DATE } from '../../common/constants'
import HackathonHeader from '../HackathonHeader'
import { useMsal } from '@azure/msal-react'
import {
  JOIN_BUTTON_COLOR,
  LEAVE_BUTTON_COLOR,
  RELOAD_BUTTON_COLOR,
} from '../../common/colors'

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
  const [ideaData, setIdeaData] = useState({} as Idea)
  const [relevantIdeaList, setRelevantIdeaList] = useState([] as Idea[])
  const [value, onChange] = useState(hackathonData.description)

  const [registrationOpen, setRegistrationOpen] = useState(false)
  const [votingOpen, setVotingOpen] = useState(false)
  const [ideaCreationOpen, setIdeaCreationOpen] = useState(false)

  const loadSelectedHackathon = () => {
    getHackathonDetails(instance, hackathonId).then(
      (data) => {
        setHackathonData(data)
        onChange(data.description)
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
      getIdeaDetails(instance, ideaPreviews.id).then(
        (data) => {
          setIdeaData(data)
          setIsIdeaLoading(false)
        },
        () => {
          setIdeaData({
            ...ideaData,
          })
        }
      )
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
      <Accordion.Item
        key={index}
        label={
          <div>
            {index + 1}. {participant.user.firstName}{' '}
            {participant.user.lastName}
          </div>
        }
      >
        <ParticipantDetails
          participantId={participant.id}
          user={participant.user}
        />
      </Accordion.Item>
    )
  )

  const allCategories = hackathonData.categories?.map((category, index) => (
    <Accordion.Item
      key={index}
      label={
        <div>
          {index + 1}. {category.title}
        </div>
      }
    >
      <CategoryDetails categoryId={category.id.toString()} />
    </Accordion.Item>
  ))

  const allIdeas = relevantIdeaList.map((idea, index) => (
    <Accordion.Item
      key={index}
      label={
        <div>
          {index + 1}. {idea.title}
        </div>
      }
    >
      <IdeaDetails
        idea={idea}
        type={IdeaCardType.Admin}
        isLoading={isIdeaLoading}
      />
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
        style={{ backgroundColor: LEAVE_BUTTON_COLOR }}
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

            {type === HackathonDetailsType.Archive && (
              <Container>
                <RichTextEditor readOnly value={value!} onChange={onChange}>
                  {hackathonData.description}
                </RichTextEditor>
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
            </Card.Section>

            <Card.Section className={classes.borderSection}>
              <Text className={classes.title}>Set Hackathon Status</Text>
              <Group>
                <Text className={classes.text}>Registration opened: </Text>
                <Switch
                  checked={registrationOpen}
                  onChange={(event) =>
                    setRegistrationOpen(event.currentTarget.checked)
                  }
                />
              </Group>
              <Group>
                <Text className={classes.text}>Idea Creation opened: </Text>
                <Switch
                  checked={ideaCreationOpen}
                  onChange={(event) =>
                    setIdeaCreationOpen(event.currentTarget.checked)
                  }
                />
              </Group>
              <Group>
                <Text className={classes.text}>Voting opened: </Text>
                <Switch
                  checked={votingOpen}
                  onChange={(event) =>
                    setVotingOpen(event.currentTarget.checked)
                  }
                />
              </Group>
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
              <RichTextEditor readOnly value={value!} onChange={onChange}>
                {hackathonData.description}
              </RichTextEditor>
            </Card.Section>

            <Accordion iconPosition='left' offsetIcon={false}>
              <Accordion.Item
                label={
                  <Text className={classes.label}>
                    Categories ( {allCategories?.length} )
                  </Text>
                }
              >
                <Accordion iconPosition='right'>
                  <Accordion.Item
                    className={classes.borderAccordion}
                    label={'Add Category'}
                  >
                    <CategoryForm
                      hackathonId={hackathonData.id}
                      context={'new'}
                      categoryId={''}
                    />
                  </Accordion.Item>
                  {allCategories}
                </Accordion>
              </Accordion.Item>
            </Accordion>

            <Accordion iconPosition='left' offsetIcon={false}>
              <Accordion.Item
                label={
                  <Text className={classes.label}>
                    Participants ( {allParticipants?.length} )
                  </Text>
                }
              >
                <Accordion iconPosition='right'>{allParticipants}</Accordion>
              </Accordion.Item>
            </Accordion>

            <Accordion iconPosition='left' offsetIcon={false}>
              <Accordion.Item
                label={
                  <Text className={classes.label}>
                    Ideas ( {allIdeas?.length} )
                  </Text>
                }
              >
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
                <Accordion iconPosition='right'>{allIdeas}</Accordion>
              </Accordion.Item>
            </Accordion>

            <Card.Section className={classes.borderSection}>
              <Group position='left' mt='xl'>
                {deleteModal}
                <Button
                  style={{ backgroundColor: LEAVE_BUTTON_COLOR }}
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
