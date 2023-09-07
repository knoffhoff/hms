import React, { useEffect, useState } from 'react'
import {
  Accordion,
  Avatar,
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Category, Idea, Skill } from '../common/types'
import { getIdeaDetails } from '../actions/IdeaActions'
import { useMsal } from '@azure/msal-react'
import short from 'short-uuid'
import { styles } from '../common/styles'
import IdeaCommentDetails from '../components/card-details/IdeaCommentDetails'
import { getCategoryDetails } from '../actions/CategoryActions'
import { getSkillDetails } from '../actions/SkillActions'
import { ArrowDownLeft } from 'tabler-icons-react'

function SingleIdea() {
  const { instance } = useMsal()
  const { classes } = styles()
  const theme = useMantineTheme()
  const { slug, idHash } = useParams()
  const location = useLocation()
  const translator = short(process.env.REACT_APP_TRANSLATOR_ALPHABET)
  const originalUuid = translator.toUUID(idHash!)
  const [ideaData, setIdeaData] = useState<Idea>({} as Idea)
  const [categoryData, setCategoryData] = useState({} as Category)
  const [skillData, setSkillData] = useState([] as Skill[])
  const [participantAccordionOpen, setParticipantAccordionOpen] =
    useState(false)
  const MAX_TITLE_LENGTH = 100

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

  const loadIdea = () => {
    getIdeaDetails(instance, originalUuid).then((idea) => {
      setIdeaData(idea)
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
      <Stack spacing={'xs'}>
        <Group position={'apart'}>
          <Group>
            <Avatar color='indigo' radius='xl' size='md'>
              {getInitials(ideaData.owner?.firstName, ideaData.owner?.lastName)}
            </Avatar>

            <Badge size='sm'>
              {ideaData.owner?.firstName} {ideaData.owner?.lastName}
            </Badge>
            {ideaCreationDate()}
          </Group>
          <UnstyledButton
            mt={10}
            component={Link}
            to={
              location.pathname.startsWith('/idea-pool')
                ? '/idea-pool'
                : `/hackathons/${slug}`
            }
          >
            <ArrowDownLeft style={{ border: '1px solid black' }} />
          </UnstyledButton>
        </Group>
        <Group>
          <Text className={classes.title} mt={0}>
            {ideaData.title?.slice(0, MAX_TITLE_LENGTH)}
            {ideaData.title?.length > MAX_TITLE_LENGTH ? '...' : ''}
          </Text>
        </Group>
      </Stack>
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
    return ideaData.title ? (
      <IdeaCommentDetails ideaId={ideaData.id} />
    ) : (
      'Loading'
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

  const ideaCreationDate = () => {
    const date = new Date(ideaData.creationDate)
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    return <Text className={classes.smallText}>Created: {formattedDate}</Text>
  }

  useEffect(() => {
    loadIdea()
  }, [])

  useEffect(() => {
    loadCategoryDetails()
    loadSkillDetails()
  }, [ideaData])

  return (
    <>
      <Card withBorder className={classes.card}>
        {ideaHeader()}
        {ideaCardText('Description', ideaData.description)}
        {ideaCardText('Problem', ideaData.problem)}
        {ideaCardText('Goal', ideaData.goal)}
        {ideaCategory()}
        {ideaRequiredSkills()}
        {participantsList()}
        <Card.Section className={classes.borderSection}>
          {IdeaComments()}
        </Card.Section>
      </Card>
    </>
  )
}

export default SingleIdea
