import React from 'react'
import {
  ActionIcon,
  Badge,
  Card,
  createStyles,
  Group,
  Text,
  Title,
  useMantineTheme,
  Avatar,
  AvatarsGroup,
  Button,
} from '@mantine/core'
import { useNavigate, useParams } from 'react-router-dom'
import ideaData from '../test/TestIdeaData'
import { Idea } from '../common/types'
import { ArrowBackUp } from 'tabler-icons-react'

const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 1000

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  like: {
    color: theme.colors.red[6],
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}))

function IdeaPortal() {
  const params = useParams()
  const theme = useMantineTheme()
  const { classes } = useStyles()
  const navigate = useNavigate()

  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]
  const idea = ideaData.find((idea) => idea.id === params.ideaId) as Idea

  const skillBadges = idea.skills.map((skill) => (
    <Badge color={theme.colorScheme === 'dark' ? 'dark' : 'gray'} key={skill}>
      {skill}
    </Badge>
  ))

  const participantAvatars = idea.participants.map((participant) => (
    <Avatar key={participant.name} src={participant.avatar} />
  ))

  const handleBackToIdeas = () => navigate(`/ideas`)

  return (
    <>
      <Button
        variant={'light'}
        leftIcon={<ArrowBackUp size={14} />}
        uppercase
        mb={30}
        onClick={handleBackToIdeas}
      >
        All ideas
      </Button>
      <Title order={1} pb={30}>
        Idea by {idea.author?.name}
      </Title>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section className={classes.section} mt="md">
          <Text size="lg" weight={500}>
            {idea.title.slice(0, MAX_TITLE_LENGTH)}
            {idea.title.length > MAX_TITLE_LENGTH ? '...' : ''}
          </Text>
          <Text size="sm" mt="xs">
            {idea.description.slice(0, MAX_DESCRIPTION_LENGTH)}
            {idea.description.length > MAX_DESCRIPTION_LENGTH ? '...' : ''}
          </Text>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} color="dimmed">
            Reason
          </Text>
          <Text size="sm" mt="xs">
            {idea.reason}
          </Text>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} color="dimmed">
            Problem
          </Text>
          <Text size="sm" mt="xs">
            {idea.problem}
          </Text>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} color="dimmed">
            Goal
          </Text>
          <Text size="sm" mt="xs">
            {idea.goal}
          </Text>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} color="dimmed">
            Skills required
          </Text>
          <Group spacing={7} mt={5}>
            {skillBadges}
          </Group>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} color="dimmed">
            Current participants
          </Text>
          <Group spacing={7} mt={5}>
            <AvatarsGroup limit={5}>{participantAvatars}</AvatarsGroup>
          </Group>
        </Card.Section>

        <Group mt="xs" position={'right'}>
          <Button variant={'outline'} color={'yellow'}>
            Add to Favorites
          </Button>
          <Button>Participate</Button>
        </Group>
      </Card>
    </>
  )
}

export default IdeaPortal
