import React, { useEffect, useState, useContext } from 'react'
import {
  Accordion,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Spoiler,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core'
import { Idea, IdeaCardType } from '../../common/types'
import { deleteIdea } from '../../actions/IdeaActions'
import IdeaForm from '../input-forms/IdeaForm'
import { styles } from '../../common/styles'
import { showNotification, updateNotification } from '@mantine/notifications'
import {
  createIdeaParticipant,
  removeIdeaParticipant,
} from '../../actions/ParticipantActions'
import { Check, X } from 'tabler-icons-react'
import { useMsal } from '@azure/msal-react'
import {
  JOIN_BUTTON_COLOR,
  DELETE_BUTTON_COLOR,
  LEAVE_BUTTON_COLOR,
} from '../../common/colors'
import { HackathonParticipantContext } from '../../pages/AllIdeas'
import { UserContext } from '../../pages/Layout'
import FinalVideoUploadModal from '../FinalVideoUploadModal'

type IProps = {
  idea: Idea
  isLoading: boolean
  type: IdeaCardType
}

export default function IdeaDetails(props: IProps) {
  const hackathonParticipantId = useContext(HackathonParticipantContext)
  const user = useContext(UserContext)
  const { instance } = useMsal()
  const { classes } = styles()
  const theme = useMantineTheme()
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [editModalOpened, setEditModalOpened] = useState(false)
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [participantAccordionOpen, setParticipantAccordionOpen] =
    useState(false)
  // const [accordionState, setAccordionState] = useAccordionState({
  //   total: 1,
  //   initialItem: -1,
  // })
  // const [participantAccordionState, setParticipantAccordionState] =
  //   useAccordionState({
  //     total: 1,
  //     initialItem: -1,
  //   })
  const [buttonIsDisabled, setButtonisDisabled] = useState(false)
  // ToDo replace user and participant id with real data after a "user" endpoint exist
  const [participantInfo, setParticipantInfo] = useState({
    userId: '',
    participantId: '',
    ideaId: '',
  })
  const [participantCheck, setParticipantCheck] = useState(false)

  const getInitials = (
    firstName: string | undefined,
    lastName: string | undefined
  ) => {
    if (firstName && lastName) {
      return `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`
    } else {
      return ''
    }
  }

  useEffect(() => {
    if (user) {
      setParticipantInfo({
        userId: user.id,
        participantId: hackathonParticipantId,
        ideaId: participantInfo.ideaId,
      })
    }
  }, [user, hackathonParticipantId])

  const { idea, type, isLoading } = props
  const MAX_TITLE_LENGTH = 100

  const participantData = idea.participants?.map((participant, index) => (
    <div
      key={index}
      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
    >
      <Avatar color='indigo' radius='xl' size='md'>
        {getInitials(participant.user.firstName, participant.user.lastName)}
      </Avatar>
      <Text className={classes.text}>
        {participant.user.firstName} {participant.user.lastName}
      </Text>
    </div>
  ))

  const deleteSelectedIdea = () => {
    showNotification({
      id: 'delete-idea-load',
      loading: true,
      title: `Deleting "${idea.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    deleteIdea(instance, idea.id).then((response) => {
      setDeleteModalOpened(false)
      if (JSON.stringify(response).toString().includes('error')) {
        setParticipantCheck(true)
        updateNotification({
          id: 'delete-idea-load',
          color: 'red',
          title: 'Failed to delete idea',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        setParticipantCheck(false)
        updateNotification({
          id: 'delete-idea-load',
          color: 'teal',
          title: `Deleted "${idea.title}"`,
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
      }
    })
  }

  const closeEditModal = (isOpened: boolean) => {
    setEditModalOpened(isOpened)
  }

  const deleteModal = (
    <Modal
      centered
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.text}>
        Are you sure you want to delete this idea?
      </Text>
      <Text className={classes.title}>Title: {idea.title}</Text>
      <Button
        style={{ backgroundColor: DELETE_BUTTON_COLOR }}
        onClick={() => deleteSelectedIdea()}
      >
        Yes, delete this idea
      </Button>
      <Text className={classes.text}>
        (This window will automatically close as soon as the idea is deleted)
      </Text>
    </Modal>
  )

  const editModal = (
    <Modal
      centered
      opened={editModalOpened}
      onClose={() => setEditModalOpened(false)}
      withCloseButton={false}
      size='55%'
    >
      <Text className={classes.title}>Edit Idea</Text>
      <IdeaForm
        ideaId={idea.id}
        idea={idea}
        context={'edit'}
        participantId={idea.owner ? idea.owner.id : ''}
        hackathon={idea.hackathon!}
        setOpened={closeEditModal}
      />
      <Text className={classes.text}>
        (This window will automatically close as soon as the idea is changed)
      </Text>
    </Modal>
  )

  const ideaDetails = () => {
    return (
      <div>
        <Card.Section className={classes.borderSection}>
          <Text className={classes.label}>Problem</Text>
          <Text className={classes.text}>{idea.problem}</Text>
        </Card.Section>

        <Card.Section className={classes.borderSection}>
          <Text className={classes.label}>Goal</Text>
          <Text className={classes.text}>{idea.goal}</Text>
        </Card.Section>

        <Card.Section className={classes.borderSection}>
          <Text className={classes.label}>Category</Text>
          <Text className={classes.text}>{idea.category?.title}</Text>
        </Card.Section>

        <Accordion
          chevronPosition={'right'}
          onChange={(value) =>
            setParticipantAccordionOpen(value === 'participants')
          }
        >
          <Accordion.Item value={'participants'}>
            <Accordion.Control>
              {!participantAccordionOpen ? (
                <div>
                  <Text className={classes.label}>Current participants</Text>
                  <Group spacing={7} mt={5}>
                    <Avatar.Group>
                      {idea.participants?.map((participant, index) => (
                        <Avatar
                          key={index}
                          color='indigo'
                          radius='xl'
                          size='md'
                        >
                          {getInitials(
                            participant.user.firstName,
                            participant.user.lastName
                          )}
                        </Avatar>
                      ))}
                    </Avatar.Group>
                  </Group>
                </div>
              ) : (
                <Text className={classes.label}>Current participants</Text>
              )}
            </Accordion.Control>
            <Accordion.Panel>{participantData}</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    )
  }

  const addIdeaParticipant = async () => {
    if (participantInfo.participantId === '') {
      showNotification({
        id: 'participant-load',
        color: 'red',
        title: 'Cannot join idea',
        message: 'You must join the hackathon first to join an idea.',
        icon: <X />,
        autoClose: 5000,
      })
      return
    }
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: `Joining "${idea.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    createIdeaParticipant(
      instance,
      participantInfo.ideaId,
      participantInfo.participantId
    ).then((response) => {
      setButtonisDisabled(false)
      if (JSON.stringify(response).toString().includes('error')) {
        setParticipantCheck(false)
        updateNotification({
          id: 'participant-load',
          color: 'red',
          title: 'Failed to join idea',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        setParticipantCheck(true)
        updateNotification({
          id: 'participant-load',
          color: 'teal',
          title: `Joined "${idea.title}"`,
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
      }
    })
  }

  const removeThisIdeaParticipant = () => {
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: `Leaving "${idea.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    removeIdeaParticipant(
      instance,
      participantInfo.ideaId,
      participantInfo.participantId
    ).then((response) => {
      setButtonisDisabled(false)
      if (JSON.stringify(response).toString().includes('error')) {
        setParticipantCheck(true)
        updateNotification({
          id: 'participant-load',
          color: 'red',
          title: 'Failed to leave Idea',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        setParticipantCheck(false)
        updateNotification({
          id: 'participant-load',
          color: 'teal',
          title: `Left "${idea.title}"`,
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
      }
    })
  }

  const findParticipant = () => {
    if (idea && idea.participants && user) {
      const participant = idea.participants.find(
        (participant) => participant.user.id === user.id
      )
      if (participant) {
        return participant
      } else {
        return null
      }
    }
  }

  useEffect(() => {
    if (findParticipant()) setParticipantCheck(!!findParticipant())
  }, [idea])

  useEffect(() => {
    setParticipantInfo((prevState) => ({
      ...prevState,
      ideaId: idea.id,
    }))
  }, [])

  return (
    <>
      {!isLoading && (
        <Card withBorder className={classes.card}>
          <Spoiler maxHeight={145} showLabel='Show more' hideLabel='Hide'>
            <Card.Section className={classes.borderSection}>
              <Group noWrap mb={15}>
                <Stack align={'center'} spacing={'xs'}>
                  <Avatar color='indigo' radius='xl' size='md'>
                    {getInitials(
                      idea.owner?.user.firstName,
                      idea.owner?.user.lastName
                    )}
                  </Avatar>
                  <Badge size='sm'>
                    {idea.owner?.user.firstName} {idea.owner?.user.lastName}
                  </Badge>
                </Stack>

                <Text className={classes.title}>
                  {idea.title?.slice(0, MAX_TITLE_LENGTH)}
                  {idea.title?.length > MAX_TITLE_LENGTH ? '...' : ''}
                </Text>
              </Group>

              <Text className={classes.text}>{idea.description}</Text>
            </Card.Section>
          </Spoiler>

          {type !== IdeaCardType.Voting && (
            <>
              <Card.Section className={classes.borderSection}>
                <Text className={classes.label}>Skills required</Text>
                <Group spacing={7} mt={5}>
                  {idea.requiredSkills?.map((skill) => (
                    <Badge
                      color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                      key={skill.id}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </Group>
              </Card.Section>

              <Accordion
                onChange={(value) => setAccordionOpen(value === 'idea-details')}
              >
                <Accordion.Item
                  className={classes.noBorderAccordion}
                  value={'idea-details'}
                >
                  <Accordion.Control>
                    {!accordionOpen && 'Show details'}
                    {accordionOpen && 'Hide details'}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <div>{ideaDetails()}</div>

                    {type === IdeaCardType.IdeaPortal && (
                      <Group
                        mt='xs'
                        position={'right'}
                        style={{ paddingTop: 5 }}
                      >
                        <Button
                          disabled={buttonIsDisabled}
                          onClick={
                            participantCheck
                              ? removeThisIdeaParticipant
                              : addIdeaParticipant
                          }
                          style={{
                            backgroundColor: participantCheck
                              ? LEAVE_BUTTON_COLOR
                              : JOIN_BUTTON_COLOR,
                          }}
                        >
                          {participantCheck ? 'Leave Idea' : 'Join Idea'}
                        </Button>
                      </Group>
                    )}

                    {(type === IdeaCardType.Admin ||
                      type === IdeaCardType.Owner) && (
                      <Group position='left' mt='xl'>
                        {deleteModal}
                        <Button
                          style={{
                            backgroundColor: DELETE_BUTTON_COLOR,
                          }}
                          onClick={() => setDeleteModalOpened(true)}
                        >
                          Delete
                        </Button>
                        {editModal}
                        <Button
                          style={{
                            backgroundColor: JOIN_BUTTON_COLOR,
                          }}
                          onClick={() => setEditModalOpened(true)}
                        >
                          Edit
                        </Button>
                        <FinalVideoUploadModal idea={idea} />
                      </Group>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </>
          )}
        </Card>
      )}
    </>
  )
}
