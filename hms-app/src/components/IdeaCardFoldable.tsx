import React, { useState } from 'react'
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
  Modal,
} from '@mantine/core'
import { Idea } from '../common/types'
import { deleteIdea } from '../actions/IdeaActions'

type IProps = {
  idea: Idea
  type: string
}

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

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}))

export default function IdeaCardFoldable(props: IProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)
  const [accordionState, setAccordionState] = useAccordionState({
    total: 1,
    initialItem: -1,
  })
  const { idea, type } = props
  const MAX_TITLE_LENGTH = 45
  const MAX_DESCRIPTION_LENGTH = type === 'voting' ? 200 : 245

  const participantData = idea.participants?.map((participant, index) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Avatar
        color="indigo"
        radius="xl"
        size="md"
        src={
          'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4'
        }
      />
      {participant.user.firstName} {participant.user.lastName}
    </div>
  ))

  const deleteSelectedIdea = () => {
    deleteIdea(idea.id).then((data) => {
      setOpened(false)
    })
  }

  const ideaDetails = () => {
    return (
      <div>
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

        <Accordion iconPosition="right">
          <Accordion.Item
            label={
              <div>
                <Text className={classes.label} color="dimmed">
                  Current participants
                </Text>
                <Group spacing={7} mt={5}>
                  <AvatarsGroup limit={5}>
                    {idea.participants?.map((participant, index) => (
                      <Avatar
                        color="indigo"
                        radius="xl"
                        size="md"
                        src={
                          'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4'
                        }
                      />
                    ))}
                  </AvatarsGroup>
                </Group>
              </div>
            }
          >
            {participantData}
          </Accordion.Item>
        </Accordion>
      </div>
    )
  }

  return (
    <>
      {!idea.isLoadingIdeaData && (
        <Card withBorder radius="md" p="md" className={classes.card}>
          <Card.Section
            className={classes.section}
            mt="md"
            style={{ height: 180 }}
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
                <Badge size="sm">
                  {idea.owner?.user.firstName} {idea.owner?.user.lastName}
                </Badge>
              </Group>

              <Text size="lg" weight={500}>
                {idea.title?.slice(0, MAX_TITLE_LENGTH)}
                {idea.title?.length > MAX_TITLE_LENGTH ? '...' : ''}
              </Text>
            </Group>

            <Text size="sm" mt="xs">
              {idea.description?.slice(0, MAX_DESCRIPTION_LENGTH)}
              {idea.description?.length > MAX_DESCRIPTION_LENGTH ? '...' : ''}
            </Text>
          </Card.Section>

          {type !== 'voting' && (
            <>
              <Card.Section className={classes.section}>
                <Text mt="md" className={classes.label} color="dimmed">
                  Skills required
                </Text>
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

              {type !== 'admin' && (
                <Accordion
                  state={accordionState}
                  onChange={setAccordionState.setState}
                >
                  <Accordion.Item
                    mt="sm"
                    style={{ border: 'none' }}
                    label={
                      !accordionState['0'] ? 'Show details' : 'Hide details'
                    }
                  >
                    <div>{ideaDetails()}</div>

                    <Group mt="xs" position={'right'} style={{ paddingTop: 5 }}>
                      <Button variant={'outline'} color={'yellow'}>
                        Add to Favorites
                      </Button>
                      <Button>Participate</Button>
                    </Group>
                  </Accordion.Item>
                </Accordion>
              )}

              {type === 'admin' && (
                <>
                  <div>{ideaDetails()}</div>

                  <Modal
                    centered
                    opened={opened}
                    onClose={() => setOpened(false)}
                    withCloseButton={false}
                  >
                    Are you sure you want to delete this idea?
                    <h4>Title: {idea.title}</h4>
                    <Button color={'red'} onClick={() => deleteSelectedIdea()}>
                      Yes, delete this idea
                    </Button>
                    <p>
                      (This window will automatically close as soon as the idea
                      is deleted)
                    </p>
                  </Modal>
                  <Group position="left" mt="xl">
                    <Button color={'red'} onClick={() => setOpened(true)}>
                      Delete
                    </Button>
                    <Button>Edit</Button>
                  </Group>
                </>
              )}
            </>
          )}
        </Card>
      )}
    </>
  )
}
