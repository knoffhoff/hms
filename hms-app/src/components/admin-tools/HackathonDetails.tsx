import React, { useEffect, useState } from 'react'
import {
  deleteHackathon,
  getHackathonDetails,
} from '../../actions/HackathonActions'
import IdeaCardList from '../IdeaCardList'
import { Hackathon, Idea } from '../../common/types'
import { getIdeaDetails } from '../../actions/IdeaActions'
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
import CategoryDetails from './CategoryDetails'
import ParticipantDetails from './ParticipantDetails'
import IdeaCardFoldable from '../IdeaCardFoldable'
import CategoryForm from './CategoryForm'

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

export default function HackathonDetails(props: IProps) {
  const { classes } = useStyles()
  const { hackathonID, type } = props
  const [modalOpened, setModalOpened] = useState(false)
  const [isHackathonError, setIsHackathonError] = useState(false)
  const [isHackathonLoading, setIsHackathonLoading] = useState(true)
  const [hackathonData, setHackathonData] = useState({
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
        })
        setIsHackathonLoading(false)
        setIsHackathonError(false)
      },
      () => {
        setIsHackathonLoading(false)
        setIsHackathonError(true)
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
      setModalOpened(false)
    })
  }

  useEffect(() => {
    loadSelectedHackathon()
    setRelevantIdeaList([])
    setIsHackathonLoading(true)
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

  const allParticipants = hackathonData.participants?.map(
    (participant, index) => (
      <Accordion.Item
        label={
          <div>
            {index + 1}. {participant.user.firstName}{' '}
            {participant.user.lastName}
          </div>
        }
      >
        <ParticipantDetails
          participantID={participant.id}
          user={participant.user}
        />
      </Accordion.Item>
    )
  )

  const allCategories = hackathonData.categories?.map((category, index) => (
    <Accordion.Item
      label={
        <div>
          {index + 1}. {category.title}
        </div>
      }
    >
      <CategoryDetails categoryID={category.id.toString()} />
    </Accordion.Item>
  ))

  const allIdeas = relevantIdeaList.slice(0).map((idea, index) => (
    <Accordion.Item
      label={
        <div>
          {index + 1}. {idea.title}
        </div>
      }
    >
      <IdeaCardFoldable idea={idea} type={'admin'} />
    </Accordion.Item>
  ))

  function refreshList() {
    setIsHackathonLoading(true)
    loadSelectedHackathon()
  }

  return (
    <>
      {isHackathonError && (
        <div>
          <h3>Error loading hackathons</h3>
          <p>something went wrong.</p>
        </div>
      )}
      {isHackathonLoading && (
        <div>
          <h3>Hackathon details are loading...</h3>
        </div>
      )}

      {hackathonData.startDate &&
        !isHackathonLoading &&
        !isHackathonError &&
        type === 'header' && (
          <div>
            <h2>Title: {hackathonData.title}</h2>
            <h2>
              Start Date: {new Date(hackathonData.startDate).toDateString()}
              End Date: {new Date(hackathonData.endDate).toDateString()}
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
        !isHackathonLoading &&
        !isHackathonError &&
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
                    Start Date:{' '}
                    {new Date(hackathonData.startDate).toDateString()}
                  </Text>
                </Card.Section>
                <Card.Section>
                  <Text size="sm" mt="xs">
                    End Date: {new Date(hackathonData.endDate).toDateString()}
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
                <Accordion iconPosition="right">
                  <Accordion.Item
                    style={{ border: '1px solid' }}
                    label={'Add Category'}
                  >
                    <CategoryForm
                      contextID={hackathonData.hackathonId}
                      context={'new'}
                    />
                  </Accordion.Item>
                  {allCategories}
                </Accordion>
              </Accordion.Item>
            </Accordion>

            <Accordion iconPosition="left" offsetIcon={false}>
              <Accordion.Item
                label={
                  <Text className={classes.label} color="dimmed">
                    Participants ( {allParticipants?.length} )
                  </Text>
                }
              >
                <Accordion iconPosition="right">{allParticipants}</Accordion>
              </Accordion.Item>
            </Accordion>

            <Accordion iconPosition="left" offsetIcon={false}>
              <Accordion.Item
                label={
                  <Text className={classes.label} color="dimmed">
                    Ideas ( {allIdeas?.length} )
                  </Text>
                }
              >
                <Accordion iconPosition="right">{allIdeas}</Accordion>
              </Accordion.Item>
            </Accordion>

            <Card.Section className={classes.section}>
              <Modal
                centered
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                withCloseButton={false}
              >
                Are you sure you want to delete this hackathon?
                <h4>Title: {hackathonData.title}</h4>
                <h4>
                  Start Date:
                  {new Date(hackathonData.startDate).toDateString()}
                </h4>
                <h4>
                  End Date:
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
                <Button color={'red'} onClick={() => setModalOpened(true)}>
                  Delete
                </Button>
                <Button>Edit</Button>
                {!isHackathonLoading && (
                  <Button color={'green'} onClick={() => refreshList()}>
                    Reload
                  </Button>
                )}
                {isHackathonLoading && <div>Loading...</div>}
              </Group>
            </Card.Section>
          </Card>
        )}
    </>
  )
}
