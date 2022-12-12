import React, { useContext, useEffect, useState } from 'react'
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
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { Category, Idea, IdeaCardType, Skill } from '../../common/types'
import { deleteIdea, getIdeaDetails } from '../../actions/IdeaActions'
import IdeaForm from '../input-forms/IdeaForm'
import { styles } from '../../common/styles'
import { showNotification, updateNotification } from '@mantine/notifications'
import {
  createIdeaParticipant,
  createIdeaVoteParticipant,
  removeIdeaParticipant,
  removeIdeaVoteParticipant,
} from '../../actions/ParticipantActions'
import { Check, X } from 'tabler-icons-react'
import { useMsal } from '@azure/msal-react'
import {
  DELETE_BUTTON_COLOR,
  JOIN_BUTTON_COLOR,
  LEAVE_BUTTON_COLOR,
} from '../../common/colors'
import {
  HackathonParticipantContext,
  HackathonVotingContext,
} from '../../pages/AllIdeas'
import { UserContext } from '../../pages/Layout'
import FinalVideoUploadModal from '../FinalVideoUploadModal'
import { getCategoryDetails } from '../../actions/CategoryActions'
import { getSkillDetails } from '../../actions/SkillActions'

type IProps = {
  idea: Idea
  isLoading: boolean
  type: IdeaCardType
}

export default function IdeaDetails(props: IProps) {
  const hackathonParticipantId = useContext(HackathonParticipantContext)
  const hackathonVotingOpened = useContext(HackathonVotingContext)
  const user = useContext(UserContext)
  const { instance } = useMsal()
  const { classes } = styles()
  const { idea, type, isLoading } = props
  const MAX_TITLE_LENGTH = 100
  const theme = useMantineTheme()
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [editModalOpened, setEditModalOpened] = useState(false)
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [participantAccordionOpen, setParticipantAccordionOpen] =
    useState(false)
  const [buttonIsDisabled, setButtonisDisabled] = useState(false)
  // ToDo replace user and participant id with real data after a "user" endpoint exist
  const [participantInfo, setParticipantInfo] = useState({
    userId: '',
    participantId: '',
  })
  const [participantCheck, setParticipantCheck] = useState(false)
  const [voteCheck, setVoteCheck] = useState(false)
  const [categoryData, setCategoryData] = useState({} as Category)
  const [skillData, setSkillData] = useState([] as Skill[])
  const [loader, setLoader] = useState(false)
  const [ideaData, setIdeaData] = useState(idea)

  const loadIdeaData = () => {
    getIdeaDetails(instance, ideaData.id).then((data) => {
      setIdeaData(data)
      setLoader(false)
    })
  }

  const loadCategoryDetails = () => {
    if (ideaData.category)
      getCategoryDetails(instance, ideaData.category.id).then((data) => {
        setCategoryData(data)
      })
  }

  const loadSkillDetails = () => {
    ideaData.requiredSkills?.map((skills) => {
      getSkillDetails(instance, skills.id).then((data) => {
        setSkillData((skillData) => [...skillData, data])
      })
    })
  }

  const getSkillDescription = (id: string) => {
    const skill = skillData.find((skill) => skill.id === id)
    if (skill) {
      return skill.description
    }
    return null
  }

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

  const participantData = ideaData.participants?.map((participant, index) => (
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
      title: `Deleting "${ideaData.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    deleteIdea(instance, ideaData.id).then((response) => {
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
          title: `Deleted "${ideaData.title}"`,
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
      <Text className={classes.title}>Title: {ideaData.title}</Text>
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
        ideaId={ideaData.id}
        idea={ideaData}
        context={'edit'}
        participantId={ideaData.owner ? ideaData.owner.id : ''}
        hackathon={ideaData.hackathon!}
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
          <Text className={classes.text}>{ideaData.problem}</Text>
        </Card.Section>

        <Card.Section className={classes.borderSection}>
          <Text className={classes.label}>Goal</Text>
          <Text className={classes.text}>{ideaData.goal}</Text>
        </Card.Section>

        <Card.Section className={classes.borderSection}>
          <Text className={classes.label}>Category</Text>
          <Tooltip
            multiline
            width={220}
            transition='fade'
            transitionDuration={200}
            color='gray'
            label={categoryData.description}
          >
            <Badge
              color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
              key={ideaData.category?.id}
            >
              {ideaData.category?.title}
            </Badge>
          </Tooltip>
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
                      {ideaData.participants?.map((participant, index) => (
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

  const addParticipant = async (
    action = createIdeaParticipant,
    check = setParticipantCheck
  ) => {
    if (participantInfo.participantId === '') {
      showNotification({
        id: 'participant-load',
        color: 'red',
        title: 'Not participating in hackathon',
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
      title: `Updating "${ideaData.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    action(instance, ideaData.id, participantInfo.participantId).then(
      (response) => {
        setButtonisDisabled(false)
        setLoader(true)
        if (JSON.stringify(response).toString().includes('error')) {
          check(false)
          updateNotification({
            id: 'participant-load',
            color: 'red',
            title: 'Failed to save idea',
            message: undefined,
            icon: <X />,
            autoClose: 2000,
          })
        } else {
          check(true)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: `Updated idea: "${ideaData.title}"`,
            message: undefined,
            icon: <Check />,
            autoClose: 2000,
          })
        }
      }
    )
  }

  const addIdeaParticipant = async () => {
    await addParticipant(createIdeaParticipant, setParticipantCheck)
  }

  const addVoterToIdea = async () => {
    await addParticipant(createIdeaVoteParticipant, setVoteCheck)
  }

  const removeParticipant = async (
    action = removeIdeaParticipant,
    check = setParticipantCheck
  ) => {
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: `Updating idea: "${ideaData.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    action(instance, ideaData.id, participantInfo.participantId).then(
      (response) => {
        setButtonisDisabled(false)
        setLoader(true)
        if (JSON.stringify(response).toString().includes('error')) {
          check(true)
          updateNotification({
            id: 'participant-load',
            color: 'red',
            title: 'Failed to save Idea',
            message: undefined,
            icon: <X />,
            autoClose: 2000,
          })
        } else {
          check(false)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: `Updated "${ideaData.title}"`,
            message: undefined,
            icon: <Check />,
            autoClose: 2000,
          })
        }
      }
    )
  }

  const removeThisIdeaParticipant = () => {
    removeParticipant(removeIdeaParticipant, setParticipantCheck)
  }

  const removeThisVote = () => {
    removeParticipant(removeIdeaVoteParticipant, setVoteCheck)
  }

  const findParticipant = () => {
    if (ideaData && ideaData.participants && user) {
      const participant = ideaData.participants.find(
        (participant) => participant.user.id === user.id
      )
      if (participant) {
        return participant
      } else {
        return null
      }
    }
  }

  const findVoter = () => {
    if (ideaData && ideaData.voters && user) {
      const voter = ideaData.voters.find((voter) => voter.user.id === user.id)
      if (voter) {
        return voter
      } else {
        return null
      }
    }
  }

  useEffect(() => {
    if (findParticipant()) setParticipantCheck(!!findParticipant())
    if (findVoter()) setVoteCheck(!!findVoter())
  }, [ideaData])

  useEffect(() => {
    loadCategoryDetails()
    loadSkillDetails()
  }, [])

  useEffect(() => {
    loadIdeaData()
  }, [loader])

  useEffect(() => {
    if (user) {
      setParticipantInfo({
        userId: user.id,
        participantId: hackathonParticipantId,
      })
    }
  }, [user, hackathonParticipantId])

  return (
    <>
      {!isLoading && (
        <Card withBorder className={classes.card}>
          <Spoiler maxHeight={145} showLabel='Show more' hideLabel='Hide'>
            <Card.Section className={classes.borderSection}>
              <Group noWrap mb={5} position='apart'>
                <Group position='left'>
                  <Stack align={'center'} spacing={'xs'}>
                    <Avatar color='indigo' radius='xl' size='md'>
                      {getInitials(
                        ideaData.owner?.user.firstName,
                        ideaData.owner?.user.lastName
                      )}
                    </Avatar>
                    <Badge size='sm'>
                      {ideaData.owner?.user.firstName}{' '}
                      {ideaData.owner?.user.lastName}
                    </Badge>
                  </Stack>
                  <Text className={classes.title}>
                    {ideaData.title?.slice(0, MAX_TITLE_LENGTH)}
                    {ideaData.title?.length > MAX_TITLE_LENGTH ? '...' : ''}
                  </Text>
                </Group>

                {hackathonVotingOpened && (
                  <Card.Section className={classes.noBorderSection}>
                    <Stack align={'center'} spacing={'xs'}>
                      <Text className={classes.label}>Votes: </Text>
                      <Text className={classes.text}>
                        {ideaData.voters?.length}
                      </Text>
                    </Stack>
                  </Card.Section>
                )}
              </Group>

              <Text className={classes.text}>{ideaData.description}</Text>
            </Card.Section>
          </Spoiler>

          {type !== IdeaCardType.Voting && (
            <>
              <Card.Section className={classes.borderSection}>
                <Text className={classes.label}>Skills required</Text>
                <Group spacing={7} mt={5}>
                  {ideaData.requiredSkills?.map((skill, index) => (
                    <Tooltip
                      multiline
                      width={220}
                      transition='fade'
                      transitionDuration={200}
                      color='gray'
                      label={getSkillDescription(skill.id)}
                      key={skill.id}
                    >
                      <Badge
                        color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                        key={skill.id}
                      >
                        {skill.name}
                      </Badge>
                    </Tooltip>
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
                        {hackathonVotingOpened && (
                          <Button
                            disabled={buttonIsDisabled}
                            onClick={
                              voteCheck ? removeThisVote : addVoterToIdea
                            }
                            style={{
                              backgroundColor: voteCheck
                                ? LEAVE_BUTTON_COLOR
                                : JOIN_BUTTON_COLOR,
                            }}
                          >
                            {voteCheck ? 'Remove Vote' : 'Vote for Idea'}
                          </Button>
                        )}
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
                        <FinalVideoUploadModal idea={ideaData} />
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
