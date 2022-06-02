import React, { useState } from 'react'
import {
  Card,
  Text,
  Button,
  useMantineTheme,
  Group,
  Badge,
  Accordion,
  Avatar,
  AvatarsGroup,
  useAccordionState,
  Modal,
} from '@mantine/core'
import { Idea } from '../../common/types'
import { deleteIdea } from '../../actions/IdeaActions'
import IdeaForm from '../input-forms/IdeaForm'
import { Spoiler } from '@mantine/core'
import { styles } from '../../common/styles'

type IProps = {
  idea: Idea
  isLoading: boolean
  type: string
}

export default function IdeaDetails(props: IProps) {
  const { classes } = styles()
  const theme = useMantineTheme()
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [editModalOpened, setEditModalOpened] = useState(false)
  const [accordionState, setAccordionState] = useAccordionState({
    total: 1,
    initialItem: -1,
  })
  const [participantAccordionState, setParticipantAccordionState] =
    useAccordionState({
      total: 1,
      initialItem: -1,
    })

  const { idea, type, isLoading } = props
  const MAX_TITLE_LENGTH = 45
  const MAX_DESCRIPTION_LENGTH = type === 'voting' ? 200 : 245

  const participantData = idea.participants?.map((participant, index) => (
    <div
      key={index}
      style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
    >
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
      setDeleteModalOpened(false)
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
      Are you sure you want to delete this idea?
      <h4>Title: {idea.title}</h4>
      <Button color={'red'} onClick={() => deleteSelectedIdea()}>
        Yes, delete this idea
      </Button>
      <p>
        (This window will automatically close as soon as the idea is deleted)
      </p>
    </Modal>
  )

  const editModal = (
    <Modal
      centered
      opened={editModalOpened}
      onClose={() => setEditModalOpened(false)}
      withCloseButton={false}
      size="55%"
    >
      Edit Idea
      <IdeaForm
        ideaId={idea.id}
        idea={idea}
        context={'edit'}
        participantId={idea.owner?.id!}
        hackathon={idea.hackathon!}
        setOpened={closeEditModal}
      />
      <p>
        (This window will automatically close as soon as the idea is edited)
      </p>
    </Modal>
  )

  const ideaDetails = () => {
    return (
      <div>
        <Card.Section className={classes.borderSection}>
          <Text mt="md" className={classes.label} color="dimmed">
            Problem
          </Text>
          <Text size="sm" mt="xs">
            {idea.problem}
          </Text>
        </Card.Section>

        <Card.Section className={classes.borderSection}>
          <Text mt="md" className={classes.label} color="dimmed">
            Goal
          </Text>
          <Text size="sm" mt="xs">
            {idea.goal}
          </Text>
        </Card.Section>

        <Accordion
          iconPosition="right"
          state={participantAccordionState}
          onChange={setParticipantAccordionState.setState}
        >
          <Accordion.Item
            label={
              !participantAccordionState['0'] ? (
                <div>
                  <Text className={classes.label} color="dimmed">
                    Current participants
                  </Text>
                  <Group spacing={7} mt={5}>
                    <AvatarsGroup limit={5}>
                      {idea.participants?.map((participant, index) => (
                        <Avatar
                          key={index}
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
              ) : (
                <Text className={classes.label} color="dimmed">
                  Current participants
                </Text>
              )
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
      {!isLoading && (
        <Card withBorder radius="md" p="md" className={classes.card}>
          <Spoiler maxHeight={140} showLabel="Show more" hideLabel="Hide">
            <Card.Section
              className={classes.borderSection}
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
                {idea.description}
              </Text>
            </Card.Section>
          </Spoiler>

          {type !== 'voting' && (
            <>
              <Card.Section className={classes.borderSection}>
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

              {type !== 'admin' && type !== 'owner' && (
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

              {type === 'owner' && (
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

                    <Group position="left" mt="xl">
                      {deleteModal}
                      <Button
                        color={'red'}
                        onClick={() => setDeleteModalOpened(true)}
                      >
                        Delete
                      </Button>
                      {editModal}
                      <Button onClick={() => setEditModalOpened(true)}>
                        Edit
                      </Button>
                    </Group>
                  </Accordion.Item>
                </Accordion>
              )}

              {type === 'admin' && (
                <>
                  <div>{ideaDetails()}</div>
                  <Group position="left" mt="xl">
                    {deleteModal}
                    <Button
                      color={'red'}
                      onClick={() => setDeleteModalOpened(true)}
                    >
                      Delete
                    </Button>
                    {editModal}
                    <Button onClick={() => setEditModalOpened(true)}>
                      Edit
                    </Button>
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
