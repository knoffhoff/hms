import React, { useState } from 'react'
import {
  Card,
  Text,
  Button,
  useMantineTheme,
  Group,
  ActionIcon,
  Modal,
  Badge,
  createStyles,
} from '@mantine/core'
import ideaData from '../test/TestIdeaData'
import IdeaCardBig from './IdeaCardBig'
import { Idea } from '../common/types'

type IProps = {
  idea: Idea
  index: number
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
  const [opened, setOpened] = useState(false)
  const [ideaDetailsClicked, setIdeaDetailsClicked] = useState(ideaData[0])

  const { classes } = useStyles()
  const theme = useMantineTheme()
  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]

  const { idea, index } = props

  function decreaseIdeaIndex() {
    if (ideaDetailsClicked.id > 0)
      setIdeaDetailsClicked(ideaData[ideaDetailsClicked.id - 1])
  }
  function increaseIdeaIndex() {
    //TODO change ideadata into index.length
    if (ideaDetailsClicked.id < ideaData.length - 1)
      setIdeaDetailsClicked(ideaData[ideaDetailsClicked.id + 1])
  }

  const skillBadges = skills.map((skill) => (
    <Badge color={theme.colorScheme === 'dark' ? 'dark' : 'gray'} key={skill}>
      {skill}
    </Badge>
  ))

  return (
    <>
      <Card shadow="sm" p="lg">
        <ActionIcon variant="light" color={'yellow'}>
          {/*TODO: check for like*/}
          {false ? (
            <span className="material-icons">star</span>
          ) : (
            <span className="material-icons">star_outline</span>
          )}
        </ActionIcon>
        <Text size={'xl'} weight={500}>
          {idea.title}
        </Text>

        <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
          {idea.description}
        </Text>

        <Group style={{ marginTop: 14 }}>
          <Modal
            centered
            withCloseButton={false}
            opened={opened}
            onClose={() => setOpened(false)}
          >
            <button onClick={decreaseIdeaIndex}>prev idea</button>
            <IdeaCardBig {...ideaDetailsClicked} />
            <button onClick={increaseIdeaIndex}>next idea</button>
          </Modal>
          <Button
            variant="filled"
            color="blue"
            onClick={() => {
              setOpened(true)
              setIdeaDetailsClicked(ideaData[index])
            }}
          >
            More information
          </Button>
        </Group>
      </Card>


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
    </>
  )
}

export default IdeaCardSmall
