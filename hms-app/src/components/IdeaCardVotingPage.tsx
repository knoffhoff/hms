import React, { useEffect } from 'react'
import {
  Card,
  Text,
  Button,
  useMantineTheme,
  Group,
  Badge,
  createStyles,
  Accordion,
  Avatar,
  AvatarsGroup,
  useAccordionState,
} from '@mantine/core'
import { Idea } from '../common/types'

type IProps = {
  idea: Idea
  index: number
}

const MAX_TITLE_LENGTH = 45
const MAX_DESCRIPTION_LENGTH = 245

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
}))

export default function IdeaCardVotingPage(props: IProps) {
  const { classes } = useStyles()

  const { idea } = props

  return (
    <>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section
          className={classes.section}
          mt="md"
          style={{ minHeight: 150 }}
        >
          <Group noWrap>
            <Group
              direction={'column'}
              align={'center'}
              position={'center'}
              spacing={'xs'}
            >
              <Avatar
                color="indigo"
                radius="xl"
                size="md"
                src={
                  'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4'
                }
              />
              <Badge size="xs">{idea.author?.name}</Badge>
            </Group>

            <Text size="lg" weight={500}>
              {idea.title.slice(0, MAX_TITLE_LENGTH)}
              {idea.title.length > MAX_TITLE_LENGTH ? '...' : ''}
            </Text>
          </Group>

          <Text size="sm" mt="xs">
            {idea.description.slice(0, MAX_DESCRIPTION_LENGTH)}
            {idea.description.length > MAX_DESCRIPTION_LENGTH ? '...' : ''}
          </Text>
        </Card.Section>
      </Card>
    </>
  )
}
