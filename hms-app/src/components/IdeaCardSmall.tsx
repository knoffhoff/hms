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

interface IdeaCardProps {
  id: number
  title: string
  description: string
  reason: string
  problem: string
  goal: string
  skills: string[]
  category: string
  participants: string[]
  aws: boolean
}

function IdeaCardSmall({ id, title, description, skills }: IdeaCardProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()

  const skillBadges = skills.map((skill) => (
    <Badge color={theme.colorScheme === 'dark' ? 'dark' : 'gray'} key={skill}>
      {skill}
    </Badge>
  ))

  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section className={classes.section} mt="md">
        <Text size="lg" weight={500}>
          {title.slice(0, MAX_TITLE_LENGTH)}
          {title.length > MAX_TITLE_LENGTH ? '...' : ''}
        </Text>
        <Text size="sm" mt="xs">
          {description.slice(0, MAX_DESCRIPTION_LENGTH)}
          {description.length > MAX_DESCRIPTION_LENGTH ? '...' : ''}
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

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }}>
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
    </Card>
  )
}

export default IdeaCardSmall
