import React, { useEffect, useState } from 'react'
import {
  deleteHackathon,
  getHackathonDetails,
} from '../actions/HackathonActions'
import IdeaCardList from './IdeaCardList'
import { Hackathon, Idea } from '../common/types'
import { deleteIdea, getIdeaDetails } from '../actions/IdeaActions'
import {
  Accordion,
  Button,
  Card,
  createStyles,
  Group,
  SimpleGrid,
  Text,
  Modal,
  TextInput,
} from '@mantine/core'
import { deleteParticipant } from '../actions/ParticipantActions'
import CategoryDetails from './CategoryDetails'

type IProps = {
  hackathonID: string
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
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}))

export default function NewHackathonDetails(props: IProps) {
  const { classes } = useStyles()
  const { hackathonID, type } = props
  const [opened, setOpened] = useState({
    hackathonModal: false,
    participantsModal: false,
    categoriesModal: false,
    ideasModal: false,
  })
  const [deleteIDs, setDeleteIDs] = useState({
    participantID: '',
    categoryID: '',
    ideaID: '',
  })
  const [hackathonData, setHackathonData] = useState({
    errorHackathonData: false,
    isLoadingHackathonData: true,
    hackathonId: 'string',
    title: 'string',
    startDate: 'string',
    endDate: 'string',
    participants: [],
    categories: [],
    ideas: [],
  } as Hackathon)
  const [ideaData, setIdeaData] = useState({
    errorIdeaData: false,
    isLoadingIdeaData: true,
    id: 'string',
    owner: undefined,
    hackathon: undefined,
    participants: [],
    title: 'string',
    description: 'string',
    problem: 'string',
    goal: 'string',
    requiredSkills: [],
    category: undefined,
    creationDate: 'string',
  } as Idea)
  const [relevantIdeaList, setRelevantIdeaList] = useState([] as Idea[])

  const loadSelectedHackathon = () => {
    getHackathonDetails(hackathonID).then(
      (data) => {
        setHackathonData({
          hackathonId: data.id,
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          participants: data.participants,
          categories: data.categories,
          ideas: data.ideas,
          errorHackathonData: false,
          isLoadingHackathonData: false,
        })
      },
      () => {
        setHackathonData({
          ...hackathonData,
          errorHackathonData: true,
          isLoadingHackathonData: false,
        })
      }
    )
  }

  const loadRelevantIdeaDetails = () => {
    hackathonData.ideas?.map((ideaPreviews) => {
      getIdeaDetails(ideaPreviews.id).then(
        (data) => {
          setIdeaData({
            id: data.id,
            owner: data.owner,
            hackathon: data.hackathon,
            participants: data.participants,
            title: data.title,
            description: data.description,
            problem: data.problem,
            goal: data.goal,
            requiredSkills: data.requiredSkills,
            category: data.category,
            creationDate: data.creationDate,
            errorIdeaData: false,
            isLoadingIdeaData: false,
          })
        },
        () => {
          setIdeaData({
            ...ideaData,
          })
        }
      )
    })
  }

  const deleteSelectedHackathon = () => {
    deleteHackathon(hackathonID).then((data) => {
      setOpened({
        ...opened,
        hackathonModal: false,
      })
    })
  }

  const deleteSelectedIdea = () => {
    deleteIdea(deleteIDs.ideaID).then((data) => {
      setOpened({
        ...opened,
        ideasModal: false,
      })
    })
  }

  const deleteSelectedParticipant = () => {
    deleteParticipant(deleteIDs.participantID).then((data) => {
      setOpened({
        ...opened,
        participantsModal: false,
      })
    })
  }

  useEffect(() => {
    loadSelectedHackathon()
    setRelevantIdeaList([])
    setHackathonData({
      ...hackathonData,
      isLoadingHackathonData: true,
    })
  }, [hackathonID])

  useEffect(() => {
    loadRelevantIdeaDetails()
  }, [hackathonData])

  useEffect(() => {
    if (
      !relevantIdeaList
        .map((relevant) => {
          return relevant.id
        })
        .includes(ideaData.id)
    ) {
      setRelevantIdeaList((relevantIdeaList) => {
        return [...relevantIdeaList, ideaData]
      })
    }
  }, [ideaData])

  const participantsPreviewData = hackathonData.participants?.map(
    (participant, index) => (
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        <li>
          Name: {participant.user.firstName} {participant.user.lastName}
        </li>
        ID: {participant.user.id}
      </SimpleGrid>
    )
  )

  const allCategories = hackathonData.categories?.map((category, index) => (
    <Accordion iconPosition="right">
      <Accordion.Item
        label={
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            <div>
              {index + 1}. {category.title}
            </div>
            <div>{category.id}</div>
          </SimpleGrid>
        }
      >
        <CategoryDetails categoryID={category.id} />
      </Accordion.Item>
    </Accordion>
  ))

  const ideasPreviewData = hackathonData.ideas?.map((idea, index) => (
    <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
      <li>Title: {idea.title}</li>
      ID: {idea.id}
    </SimpleGrid>
  ))

  return (
    <>
      {hackathonData.errorHackathonData && (
        <div>
          <h3>Error loading hackathons</h3>
          <p>something went wrong.</p>
        </div>
      )}
      {hackathonData.isLoadingHackathonData && (
        <div>
          <h3>Hackathon details are loading...</h3>
        </div>
      )}

      {hackathonData.startDate &&
        !hackathonData.isLoadingHackathonData &&
        type === 'header' && (
          <div>
            <h2>Title: {hackathonData.title}</h2>
            <h2>
              Date from: {new Date(hackathonData.startDate).toDateString()} to:{' '}
              {new Date(hackathonData.endDate).toDateString()}
            </h2>
            <h2>All Ideas ({hackathonData.ideas?.length})</h2>

            <IdeaCardList
              ideas={relevantIdeaList}
              columnSize={6}
              type={'Archive'}
            />
          </div>
        )}

      {hackathonData.startDate &&
        !hackathonData.isLoadingHackathonData &&
        type === 'fullInfo' && (
          <Card withBorder radius="md" p="md" className={classes.card}>
            <Card.Section className={classes.section}>
              <Text size="md" mt="xs">
                {hackathonData.title}
              </Text>
              <Text size={'xs'}>ID: {hackathonData.hackathonId}</Text>
            </Card.Section>
            <Card.Section className={classes.section}>
              <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                <Card.Section>
                  <Text size="sm" mt="xs">
                    From: {new Date(hackathonData.startDate).toDateString()}
                  </Text>
                </Card.Section>
                <Card.Section>
                  <Text size="sm" mt="xs">
                    To: {new Date(hackathonData.endDate).toDateString()}
                  </Text>
                </Card.Section>
              </SimpleGrid>
            </Card.Section>

            <Accordion iconPosition="left" offsetIcon={false}>
              <Accordion.Item
                label={
                  <Text className={classes.label} color="dimmed">
                    Categories ( {allCategories?.length} )
                  </Text>
                }
              >
                {allCategories}
              </Accordion.Item>
            </Accordion>

            <Accordion iconPosition="left">
              <Accordion.Item
                label={
                  <Text className={classes.label} color="dimmed">
                    Participants ( {participantsPreviewData?.length} )
                  </Text>
                }
              >
                <ol>{participantsPreviewData}</ol>
                <Modal
                  centered
                  opened={opened.participantsModal}
                  onClose={() =>
                    setOpened({
                      ...opened,
                      participantsModal: false,
                    })
                  }
                  withCloseButton={false}
                >
                  Are you sure you want to delete this participant?
                  <h4>Name: (add the name of the participant here)</h4>
                  <Button
                    color={'red'}
                    onClick={() => deleteSelectedParticipant()}
                  >
                    Yes delete this participant
                  </Button>
                  <p>
                    (This window will automatically closed as soon as the idea
                    is deleted)
                  </p>
                </Modal>
                <Group position="left" mt="xl">
                  <TextInput
                    required
                    placeholder={'put the participant id here'}
                    value={deleteIDs.participantID}
                    onChange={(event) =>
                      setDeleteIDs({
                        ...deleteIDs,
                        participantID: event.currentTarget.value,
                      })
                    }
                  />
                  <Button
                    color={'red'}
                    onClick={() =>
                      setOpened({
                        ...opened,
                        participantsModal: true,
                      })
                    }
                  >
                    Delete Participant
                  </Button>
                </Group>
              </Accordion.Item>
            </Accordion>

            <Accordion iconPosition="left">
              <Accordion.Item
                label={
                  <Text className={classes.label} color="dimmed">
                    Ideas ( {ideasPreviewData?.length} )
                  </Text>
                }
              >
                <ol>{ideasPreviewData}</ol>
                <Modal
                  centered
                  opened={opened.ideasModal}
                  onClose={() =>
                    setOpened({
                      ...opened,
                      ideasModal: false,
                    })
                  }
                  withCloseButton={false}
                >
                  Are you sure you want to delete this idea?
                  <h4>Title: (add the name of the idea here)</h4>
                  <Button color={'red'} onClick={() => deleteSelectedIdea()}>
                    Yes delete this idea
                  </Button>
                  <p>
                    (This window will automatically closed as soon as the idea
                    is deleted)
                  </p>
                </Modal>
                <Group position="left" mt="xl">
                  <TextInput
                    required
                    placeholder={'put the idea id here'}
                    value={deleteIDs.ideaID}
                    onChange={(event) =>
                      setDeleteIDs({
                        ...deleteIDs,
                        ideaID: event.currentTarget.value,
                      })
                    }
                  />
                  <Button
                    color={'red'}
                    onClick={() =>
                      setOpened({
                        ...opened,
                        ideasModal: true,
                      })
                    }
                  >
                    Delete Idea
                  </Button>
                </Group>
              </Accordion.Item>
            </Accordion>

            <Card.Section className={classes.section}>
              <Modal
                centered
                opened={opened.hackathonModal}
                onClose={() =>
                  setOpened({
                    ...opened,
                    hackathonModal: false,
                  })
                }
                withCloseButton={false}
              >
                Are you sure you want to delete this hackathon?
                <h4>Title: {hackathonData.title}</h4>
                <h4>
                  Date from:
                  {new Date(hackathonData.startDate).toDateString()}
                </h4>
                <h4>
                  to:
                  {new Date(hackathonData.endDate).toDateString()}
                </h4>
                <Button color={'red'} onClick={() => deleteSelectedHackathon()}>
                  Yes delete this hackathon
                </Button>
                <p>
                  (This window will automatically closed as soon as the
                  hackathon is deleted)
                </p>
              </Modal>
              <Group position="left" mt="xl">
                <Button
                  color={'red'}
                  onClick={() =>
                    setOpened({
                      ...opened,
                      hackathonModal: true,
                    })
                  }
                >
                  Delete Hackathon
                </Button>
                <Button>Edit Hackathon</Button>
                <Button color={'green'} onClick={() => loadSelectedHackathon()}>
                  Reload Details
                </Button>
              </Group>
            </Card.Section>
          </Card>
        )}
    </>
  )
}
