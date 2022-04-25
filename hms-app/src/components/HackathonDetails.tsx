import React, { useEffect, useState } from 'react'
import {
  deleteHackathon,
  getHackathonDetails,
} from '../actions/HackathonActions'
import IdeaCardList from './IdeaCardList'
import { Hackathon, Idea } from '../common/types'
import { getIdeaDetails } from '../actions/IdeaActions'
import {
  Accordion,
  Button,
  Card,
  createStyles,
  Group,
  SimpleGrid,
  Text,
  Modal,
} from '@mantine/core'

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
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
  list: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  list2: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.gray[3],
  },
}))

export default function HackathonDetails(props: IProps) {
  const { classes } = useStyles()
  const { hackathonID, type } = props
  const [opened, setOpened] = useState(false)
  const [hackathonData, setHackathonData] = useState({
    errorHackathonData: false,
    isLoadingHackathonData: true,
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

  const deleteSelectedHackathon = () => {
    console.log('button pressed')
    deleteHackathon(hackathonID).then((data) => {
      setOpened(false)
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
      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        className={index % 2 ? classes.list : classes.list2}
      >
        <li>
          Name: {participant.user.firstName} {participant.user.lastName}
        </li>
        ID: {participant.user.id}
      </SimpleGrid>
    )
  )

  const categoriesPreviewData = hackathonData.categories?.map(
    (category, index) => (
      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        className={index % 2 ? classes.list : classes.list2}
      >
        <li>Name: {category.title}</li>
        ID: {category.id}
      </SimpleGrid>
    )
  )

  const ideasPreviewData = hackathonData.ideas?.map((idea, index) => (
    <SimpleGrid
      cols={2}
      breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
      className={index % 2 ? classes.list : classes.list2}
    >
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
              <Text mt="md" className={classes.label} color="dimmed">
                Title:
              </Text>
              <Text size="sm" mt="xs">
                {hackathonData.title}
              </Text>
            </Card.Section>
            <Card.Section className={classes.section}>
              <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                <Card.Section>
                  <Text mt="md" className={classes.label} color="dimmed">
                    Start Date:
                  </Text>
                  <Text size="sm" mt="xs">
                    {new Date(hackathonData.startDate).toDateString()}
                  </Text>
                </Card.Section>
                <Card.Section>
                  <Text mt="md" className={classes.label} color="dimmed">
                    End Date:
                  </Text>
                  <Text size="sm" mt="xs">
                    {new Date(hackathonData.endDate).toDateString()}
                  </Text>
                </Card.Section>
              </SimpleGrid>
            </Card.Section>
            <Accordion iconPosition="left">
              <Accordion.Item
                label={
                  <Text className={classes.label} color="dimmed">
                    Categories ( {categoriesPreviewData?.length} )
                  </Text>
                }
              >
                <ol>{categoriesPreviewData}</ol>
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
              </Accordion.Item>
            </Accordion>
            <Card.Section className={classes.section}>
              <Group position="left" mt="xl">
                <Modal
                  centered
                  opened={opened}
                  onClose={() => setOpened(false)}
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
                  <Button
                    color={'red'}
                    onClick={() => deleteSelectedHackathon()}
                  >
                    Yes delete this hackathon
                  </Button>
                  <p>
                    (This window will automatically closed as soon as the
                    hackathon is deleted)
                  </p>
                </Modal>
                <Button color={'red'} onClick={() => setOpened(true)}>
                  Delete Hackathon
                </Button>
                <Button>Edit Hackathon</Button>
              </Group>
            </Card.Section>
          </Card>
        )}
    </>
  )
}
