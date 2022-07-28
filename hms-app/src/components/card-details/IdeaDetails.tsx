import React, { useEffect, useState, useContext } from 'react'
import {
  Accordion,
  Avatar,
  AvatarsGroup,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Spoiler,
  Text,
  useAccordionState,
  useMantineTheme,
} from '@mantine/core'
import { Idea, IdeaCardType, ParticipantPreview } from '../../common/types'
import { deleteIdea } from '../../actions/IdeaActions'
import IdeaForm from '../input-forms/IdeaForm'
import { styles } from '../../common/styles'
import { showNotification, updateNotification } from '@mantine/notifications'
import {
  createIdeaParticipant,
  removeIdeaParticipant,
} from '../../actions/ParticipantActions'
import { CheckIcon, Cross2Icon } from '@modulz/radix-icons'
import { useMsal } from '@azure/msal-react'
import {
  JOIN_BUTTON_COLOR,
  DELETE_BUTTON_COLOR,
  LEAVE_BUTTON_COLOR,
} from '../../common/colors'
import { HackathonParticipantContext } from '../../pages/AllIdeas'
import { UserContext } from '../../pages/Layout'

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
  const [accordionState, setAccordionState] = useAccordionState({
    total: 1,
    initialItem: -1,
  })
  const [participantAccordionState, setParticipantAccordionState] =
    useAccordionState({
      total: 1,
      initialItem: -1,
    })
  const [buttonIsDisabled, setButtonisDisabled] = useState(false)
  // ToDo replace user and participant id with real data after a "user" endpoint exist
  const [participantInfo, setParticipantInfo] = useState({
    userId: '',
    participantId: '',
    ideaId: '',
  })
  const [participantCheck, setParticipantCheck] = useState(false)

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
      <Avatar
        color='indigo'
        radius='xl'
        size='md'
        src={
          'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4'
        }
      />
      <Text className={classes.text}>
        {participant.user.firstName} {participant.user.lastName}
      </Text>
    </div>
  ))

  const deleteSelectedIdea = () => {
    deleteIdea(instance, idea.id).then(() => {
      setDeleteModalOpened(false)
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

        <Accordion
          iconPosition='right'
          state={participantAccordionState}
          onChange={setParticipantAccordionState.setState}
        >
          <Accordion.Item
            label={
              !participantAccordionState['0'] ? (
                <div>
                  <Text className={classes.label}>Current participants</Text>
                  <Group spacing={7} mt={5}>
                    <AvatarsGroup limit={5}>
                      {idea.participants?.map((participant, index) => (
                        <Avatar
                          key={index}
                          color='indigo'
                          radius='xl'
                          size='md'
                          src={
                            'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4'
                          }
                        />
                      ))}
                    </AvatarsGroup>
                  </Group>
                </div>
              ) : (
                <Text className={classes.label}>Current participants</Text>
              )
            }
          >
            {participantData}
          </Accordion.Item>
        </Accordion>
      </div>
    )
  }

  const addIdeaParticipant = () => {
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: 'Join Idea',
      message: undefined,
      autoClose: false,
      disallowClose: true,
    })
    createIdeaParticipant(
      instance,
      participantInfo.ideaId,
      participantInfo.participantId
    ).then((response) => {
      setTimeout(() => {
        console.log('response', response)
        setButtonisDisabled(false)
        if (JSON.stringify(response).toString().includes('error')) {
          setParticipantCheck(false)
          updateNotification({
            id: 'participant-load',
            color: 'red',
            title: 'Failed to join Idea',
            message: undefined,
            icon: <Cross2Icon />,
            autoClose: 2000,
          })
        } else {
          setParticipantCheck(true)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: 'Joined Idea',
            message: undefined,
            icon: <CheckIcon />,
            autoClose: 2000,
          })
        }
      }, 3000)
    })
  }

  const removeThisIdeaParticipant = () => {
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: 'Leave Idea',
      message: undefined,
      autoClose: false,
      disallowClose: true,
    })
    removeIdeaParticipant(
      instance,
      participantInfo.ideaId,
      participantInfo.participantId
    ).then((response) => {
      console.log(response)
      setButtonisDisabled(false)
      setTimeout(() => {
        if (JSON.stringify(response).toString().includes('errorMessage')) {
          setParticipantCheck(true)
          updateNotification({
            id: 'participant-load',
            color: 'red',
            title: 'Failed to leave Idea',
            message: undefined,
            icon: <Cross2Icon />,
            autoClose: 2000,
          })
        } else {
          setParticipantCheck(false)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: 'Left Idea',
            message: undefined,
            icon: <CheckIcon />,
            autoClose: 2000,
          })
        }
      }, 3000)
    })
  }

  let findParticipant: ParticipantPreview | null
  if (idea && idea.participants) {
    findParticipant = idea.participants.find(
      (participant) => participant.user.id === participantInfo.userId
    )!
  } else {
    findParticipant = null
  }

  useEffect(() => {
    if (findParticipant) setParticipantCheck(!!findParticipant)
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
          <Spoiler maxHeight={130} showLabel='Show more' hideLabel='Hide'>
            <Card.Section className={classes.borderSection}>
              <Group noWrap>
                <Group
                  direction={'column'}
                  align={'center'}
                  position={'center'}
                  spacing={'xs'}
                >
                  <Avatar
                    color='indigo'
                    radius='xl'
                    size='md'
                    src={
                      'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4'
                    }
                  />
                  <Badge size='sm'>
                    {idea.owner?.user.firstName} {idea.owner?.user.lastName}
                  </Badge>
                </Group>

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
                state={accordionState}
                onChange={setAccordionState.setState}
              >
                <Accordion.Item
                  className={classes.noBorderAccordion}
                  label={!accordionState['0'] ? 'Show details' : 'Hide details'}
                >
                  <div>{ideaDetails()}</div>

                  {type === IdeaCardType.IdeaPortal && (
                    <Group mt='xs' position={'right'} style={{ paddingTop: 5 }}>
                      {/* <Button variant={'outline'} color={'yellow'}>
                        Add to Favorites
                      </Button>*/}

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
                    </Group>
                  )}
                </Accordion.Item>
              </Accordion>
            </>
          )}
        </Card>
      )}
    </>
  )
}
