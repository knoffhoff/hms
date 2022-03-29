import React from 'react'
import {
  Card,
  Text,
  Button,
  useMantineTheme,
  Group,
  ActionIcon,
  Badge,
  createStyles,
} from '@mantine/core'
import { Idea } from '../common/types'
import { useNavigate } from 'react-router-dom'

type IProps = {
  idea: Idea
  index: number
  hasBottomButtons?: boolean
  hasSkillsSection?: boolean
  hasDescription?: boolean
}

const MAX_TITLE_LENGTH = 85
const MAX_DESCRIPTION_LENGTH = 150

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

function IdeaCardSmall(props: IProps) {
  const navigate = useNavigate()
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]

  const { idea } = props
  const hasBottomButtons = props.hasBottomButtons ?? true
  const hasSkillsSection = props.hasSkillsSection ?? true
  const hasDescription = props.hasDescription ?? true

  const handleClickMoreInformation = () => navigate(`/ideas/${idea.id}`)

  const skillBadges = idea.skills.map((skill) => (
    <Badge color={theme.colorScheme === 'dark' ? 'dark' : 'gray'} key={skill}>
      {skill}
    </Badge>
  ))

  return (
    <>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section
          className={classes.section}
          mt="md"
          style={{ minHeight: 150 }}
        >
          <Text size="lg" weight={500}>
            {idea.title.slice(0, MAX_TITLE_LENGTH)}
            {idea.title.length > MAX_TITLE_LENGTH ? '...' : ''}
          </Text>
          <Badge size="md" my={15}>
            {idea.author?.name}
          </Badge>
          {hasDescription && (
            <Text size="sm" mt="xs">
              {idea.description.slice(0, MAX_DESCRIPTION_LENGTH)}
              {idea.description.length > MAX_DESCRIPTION_LENGTH ? '...' : ''}
            </Text>
          )}
        </Card.Section>

        {hasSkillsSection && (
          <Card.Section className={classes.section}>
            <Text mt="md" className={classes.label} color="dimmed">
              Skills required
            </Text>
            <Group spacing={7} mt={5}>
              {skillBadges}
            </Group>
          </Card.Section>
        )}

        {hasBottomButtons && (
          <Group mt="xs">
            <Button
              radius="md"
              style={{ flex: 1 }}
              onClick={handleClickMoreInformation}
            >
              Show details
            </Button>
            <ActionIcon variant="default" radius="md" size={36}>
              {/*TODO: check for like*/}
              {false ? (
                <span className="material-icons" style={{ color: '#f1c40f' }}>
                  star
                </span>
              ) : (
                <span className="material-icons" style={{ color: '#f1c40f' }}>
                  star_outline
                </span>
              )}
            </ActionIcon>
          </Group>
        )}
      </Card>
    </>
  )
}

export default IdeaCardSmall
