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
import { getIdeaDetails } from '../../actions/IdeaActions'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import {
  HackathonParticipantContext,
  HackathonVotingContext,
} from '../../pages/AllIdeas'
import { UserContext } from '../../pages/Layout'
import { getCategoryDetails } from '../../actions/CategoryActions'
import { getSkillDetails } from '../../actions/SkillActions'
import IdeaCommentDetails from './IdeaCommentDetails'
import CardButton from './CardButton'
import ParticipantsHandler from './ParticipantsHandler'
import { isPropertySignature } from 'typescript'
import VotingHandler from './VotingHandler'

export type IProps = {
  idea: Idea
  isLoading: boolean
  type: IdeaCardType
}

export default function IdeaDetails(props: IProps) {
  const hackathonParticipantId = useContext(HackathonParticipantContext)
  const hackathonVotingOpened = useContext(HackathonVotingContext)
  const user = useContext(UserContext)
  const { classes } = styles()
  const { idea, type, isLoading } = props
  const MAX_TITLE_LENGTH = 100
  const theme = useMantineTheme()
  const [accordionOpen, setAccordionOpen] = useState(false)

  const { instance } = useMsal()
  const [categoryData, setCategoryData] = useState({} as Category)
  const [skillData, setSkillData] = useState([] as Skill[])
  const [loader, setLoader] = useState(false)
  const [ideaData, setIdeaData] = useState(idea)
  const [participantInfo, setParticipantInfo] = useState({
    userId: '',
    participantId: '',
  })

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

  const ideaDescription = () => {
    return <Text className={classes.text}>{ideaData.description}</Text>
  }

  const ideaProblem = () => {
    return (
      <Card.Section className={classes.borderSection}>
        <Text className={classes.label}>Problem</Text>
        <Text className={classes.text}>{ideaData.problem}</Text>
      </Card.Section>
    )
  }

  const ideaGoal = () => {
    return (
      <Card.Section className={classes.borderSection}>
        <Text className={classes.label}>Goal</Text>
        <Text className={classes.text}>{ideaData.goal}</Text>
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

  const ideaButtons = () => {
    return (
      type === IdeaCardType.Admin ||
      ((type === IdeaCardType.Owner || ideaData.owner?.id === user?.id) && (
        <CardButton idea={props.idea} reloadIdeaDetails={loadIdeaData} />
      ))
    )
  }

  const votingButton = () => {
    return (
      { hackathonVotingOpened } && type === IdeaCardType.AllIdeas && (
        <VotingHandler idea={props.idea} /> 
      )
    )
  }

  const participateButton = () => {
    return(
      type === IdeaCardType.AllIdeas && (
          <ParticipantsHandler idea={props.idea} />
        )
    ) 
  }

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
      {!isLoading &&
      (type === IdeaCardType.IdeaPortal || type === IdeaCardType.AllIdeas) ? (
        <Card withBorder className={classes.card}>
          <Spoiler maxHeight={145} showLabel='Show more' hideLabel='Hide'>
            <Card.Section className={classes.borderSection}>
              <Group noWrap mb={5} position='apart'>
                {ideaHeader()}
              </Group>
              {ideaDescription()}
            </Card.Section>
          </Spoiler>
          {votingButton()}
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
                {ideaCategory()}
                {ideaRequiredSkills()}
                {ideaProblem()}
                {ideaGoal()}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          {participateButton()}
          {ideaButtons()}
        </Card>
      ) : (
        'Failed to load ideas.'
      )}
    </>
  )
}
