import React, { useContext, useEffect, useState } from 'react'
import {
  Accordion,
  Avatar,
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core'
import { Category, Idea, IdeaCardType, Skill } from '../../common/types'
import { getIdeaDetails } from '../../actions/IdeaActions'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import { HackathonVotingContext } from '../../pages/AllIdeas'
import { UserContext } from '../../pages/Layout'
import { getCategoryDetails } from '../../actions/CategoryActions'
import { getSkillDetails } from '../../actions/SkillActions'
import IdeaCommentDetails from './IdeaCommentDetails'
import CardButton from '../buttons/CardButton'
import ParticipateButton from '../buttons/ParticipateButton'
import { VoteButtons } from '../buttons/VotingButton'
import ParticipantsList from '../lists/ParticipantsList'

type IProps = {
  idea: Idea
  isLoading: boolean
  type: IdeaCardType
  onSuccess?: () => void
  ishackathonStarted?: boolean
}

export default function IdeaDetails(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { idea, type, isLoading, onSuccess, ishackathonStarted } = props
  const hackathonVotingOpened = useContext(HackathonVotingContext)
  const user = useContext(UserContext)
  const MAX_TITLE_LENGTH = 100
  const theme = useMantineTheme()
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [categoryData, setCategoryData] = useState({} as Category)
  const [skillData, setSkillData] = useState([] as Skill[])
  const [loader, setLoader] = useState(false)
  const [ideaData, setIdeaData] = useState(idea)
  const [participantAccordionOpen, setParticipantAccordionOpen] =
  useState(false)

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

  useEffect(() => {
    loadCategoryDetails()
    loadSkillDetails()
  }, [])

  useEffect(() => {
    loadIdeaData()
  }, [loader])

  const loadIdeaData = () => {
    getIdeaDetails(instance, ideaData.id).then((data) => {
      setIdeaData(data)
      setLoader(false)
    })
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

  // Idea Card Functions
  const ideaHeader = () => {
    return (
      <Group position='left'>
        <Stack align={'center'} spacing={'xs'}>
          <Avatar color='indigo' radius='xl' size='md'>
            {getInitials(ideaData.owner?.firstName, ideaData.owner?.lastName)}
          </Avatar>
          <Badge size='sm'>
            {ideaData.owner?.firstName} {ideaData.owner?.lastName}
          </Badge>
        </Stack>
        <Text className={classes.title}>
          {ideaData.title?.slice(0, MAX_TITLE_LENGTH)}
          {ideaData.title?.length > MAX_TITLE_LENGTH ? '...' : ''}
        </Text>
      </Group>
    )
  }

  const ideaCardText = (label: string, text: string) => {
    return (
      <Card.Section className={classes.borderSection}>
        <Text className={classes.label}>{label}</Text>
        <Text className={classes.text}>{text}</Text>
      </Card.Section>
    )
  }

  const ideaCategory = () => {
    return (
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
    )
  }

  const ideaRequiredSkills = () => {
    return (
      <Card.Section className={classes.borderSection}>
        <Text className={classes.label}>Skills required</Text>
        <Group spacing={7} mt={5}>
          {ideaData.requiredSkills?.map((skill) => (
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
    )
  }

  const IdeaComments = () => {
    return <IdeaCommentDetails ideaId={props.idea.id} />
  }

  const ideaButtons = () => {
    return (
      (type === IdeaCardType.Admin ||
        type === IdeaCardType.Owner ||
        ideaData.owner?.id === user?.id) && (
        <CardButton
          idea={props.idea}
          onSuccess={refreshAfterChange}
          type={type}
          ishackathonStarted={ishackathonStarted}
        />
      )
    )
  }

  const votingButton = () => {
    return (
      type === IdeaCardType.AllIdeas && (
        <VoteButtons idea={props.idea} onSuccess={() => setLoader(!loader)} />
      )
    )
  }

  const voterCount = () => {
    return (
      type === IdeaCardType.AllIdeas && (
        <Card.Section className={classes.noBorderSection}>
          <Stack align={'center'} spacing={'xs'}>
            <Text className={classes.label}>Votes: </Text>
            <Text className={classes.text}>{ideaData.voters?.length}</Text>
          </Stack>
        </Card.Section>
      )
    )
  }

  // Temporary solution for displaying participants
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

  const participantsList = () => {
    return (
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
                      <Avatar key={index} color='indigo' radius='xl' size='md'>
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
    )
  }

  const participateButton = () => {
    return (
      (type === IdeaCardType.AllIdeas || type === IdeaCardType.Admin) && (
        <ParticipateButton
          idea={props.idea}
          onSuccess={() => setLoader(!loader)}
        />
      )
    )
  }

  const refreshAfterChange = () => {
    loadIdeaData()
    if (onSuccess) {
      onSuccess()
    }
  }

  const ideaCreationDate = () => {
    return (
      <Text className={classes.smallText}>
        Created: {new Date(idea.creationDate).toDateString()}
      </Text>
    )
  }

  return (
    <>
      {!isLoading && type !== IdeaCardType.Voting ? (
        <Card withBorder className={classes.card}>
          <Card.Section className={classes.ideaCardHeader}>
            <Group noWrap mb={5} position='apart'>
              {ideaHeader()}
              {hackathonVotingOpened && (
                <Stack align={'Center'} spacing={'xs'}>
                  {voterCount()}
                </Stack>
              )}
            </Group>
            {ideaCreationDate()}
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
                {ideaCardText('Description', ideaData.description)}
                {ideaCardText('Problem', ideaData.problem)}
                {ideaCardText('Goal', ideaData.goal)}
                {ideaCategory()}
                {ideaRequiredSkills()}
                {participantsList()}
                <Group mt='xs' position={'center'} style={{ paddingTop: 5 }}>
                  {participateButton()}
                  {hackathonVotingOpened && votingButton()}
                </Group>
                {ideaButtons()}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          {IdeaComments()}
        </Card>
      ) : (
        'Failed to load ideas.'
      )}
    </>
  )
}
