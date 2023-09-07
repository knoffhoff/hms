import React, { useEffect, useState } from 'react'
import {
  deleteHackathon,
  editHackathon,
  getHackathonDetails,
} from '../../actions/HackathonActions'
import { Hackathon, HackathonDetailsType } from '../../common/types'
import {
  Button,
  Card,
  Group,
  Modal,
  SimpleGrid,
  Switch,
  Text,
} from '@mantine/core'
import HackathonForm from '../input-forms/HackathonForm'
import { styles } from '../../common/styles'
import { NULL_DATE } from '../../common/constants'
import { useMsal } from '@azure/msal-react'
import { DELETE_BUTTON_COLOR, JOIN_BUTTON_COLOR } from '../../common/colors'
import { showNotification, updateNotification } from '@mantine/notifications'
import { RichTextEditor } from '@mantine/rte'
import AllCategoryList from '../lists/AllCategoryList'
import AllParticipantList from '../lists/AllParticipantList'
import AllIdeaList from '../lists/AllIdeaList'
import { CustomCheckIcon, CustomXIcon } from '../NotificationIcons'

type IProps = {
  hackathonId: string
  type: HackathonDetailsType
  onSuccess: () => void
}

export default function HackathonDetails(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { hackathonId, type, onSuccess } = props
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [editModalOpened, setEditModalOpened] = useState(false)
  const [isHackathonError, setIsHackathonError] = useState(false)
  const [isHackathonLoading, setIsHackathonLoading] = useState(true)
  const [hackathonData, setHackathonData] = useState({} as Hackathon)
  const [votingOpened, setVotingOpened] = useState<boolean>(false)

  const loadSelectedHackathon = () => {
    getHackathonDetails(instance, hackathonId).then(
      (data) => {
        setHackathonData(data)
        setVotingOpened(data.votingOpened)
        setIsHackathonLoading(false)
        setIsHackathonError(false)
      },
      () => {
        setIsHackathonLoading(false)
        setIsHackathonError(true)
      }
    )
  }

  const deleteSelectedHackathon = () => {
    deleteHackathon(instance, hackathonId).then(() => {
      setDeleteModalOpened(false)
      onSuccess()
    })
  }

  useEffect(() => {
    loadSelectedHackathon()
    setIsHackathonLoading(true)
  }, [hackathonId])

  const deleteModal = (
    <Modal
      centered
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.text}>
        Are you sure you want to delete this hackathon?
      </Text>
      <Text className={classes.title}>Title: {hackathonData.title}</Text>
      <Text className={classes.title}>
        Start Date: {new Date(hackathonData.startDate).toDateString()}
      </Text>
      <Text className={classes.title}>
        End Date: {new Date(hackathonData.endDate).toDateString()}
      </Text>
      <Button
        style={{ backgroundColor: DELETE_BUTTON_COLOR }}
        onClick={() => deleteSelectedHackathon()}
      >
        Yes delete this hackathon
      </Button>
      <Text className={classes.text}>
        (This window will automatically closed as soon as the hackathon is
        deleted)
      </Text>
    </Modal>
  )

  const refreshAfterChange = () => {
    setEditModalOpened(false)
    setIsHackathonLoading(true)
    loadSelectedHackathon()
    onSuccess()
  }

  const editModal = (
    <Modal
      centered
      size='55%'
      opened={editModalOpened}
      onClose={() => setEditModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.title}>Edit Hackathon</Text>
      <HackathonForm
        context={'edit'}
        hackathonId={hackathonData.id}
        onSuccess={refreshAfterChange}
      />
      {isHackathonLoading && <div>Loading...</div>}
      <Text className={classes.text}>
        (This window will automatically close after the hackathon is edited)
      </Text>
    </Modal>
  )

  const statusToggles = (
    <>
      <Group>
        <Text className={classes.text}>Voting opened: </Text>
        <Switch
          checked={votingOpened}
          onChange={(event) => editThisHackathon(event.currentTarget.checked)}
        />
      </Group>
    </>
  )

  function editThisHackathon(event: boolean) {
    showNotification({
      id: 'hackathon-load',
      loading: true,
      title: `Editing ${hackathonData.title}`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    editHackathon(
      instance,
      hackathonId!,
      hackathonData.title,
      hackathonData.description!,
      hackathonData.slug,
      hackathonData.startDate!,
      hackathonData.endDate!,
      event
    ).then((response) => {
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'hackathon-load',
          color: 'red',
          title: 'Failed to edit hackathon',
          message: undefined,
          icon: <CustomXIcon />,
          autoClose: 5000,
        })
      } else {
        setVotingOpened(event)
        updateNotification({
          id: 'hackathon-load',
          color: 'teal',
          title: `Edited ${hackathonData.title}`,
          message: undefined,
          icon: <CustomCheckIcon />,
          autoClose: 5000,
        })
      }
    })
  }

  return (
    <>
      {isHackathonError && (
        <div>
          <Text className={classes.title}>Error loading hackathons</Text>
          <Text className={classes.text}>something went wrong.</Text>
        </div>
      )}
      {isHackathonLoading && (
        <div>
          <Text className={classes.text}>Hackathon details are loading...</Text>
        </div>
      )}

      {hackathonData.startDate !== NULL_DATE &&
        hackathonData.startDate?.toString() !== 'Invalid Date' &&
        !isHackathonLoading &&
        !isHackathonError &&
        type === HackathonDetailsType.FullInfo && (
          <Card withBorder className={classes.card}>
            <Card.Section className={classes.borderSection}>
              <Text className={classes.title}>{hackathonData.title}</Text>
              <Text className={classes.text}>ID: {hackathonData.id}</Text>
              <Text className={classes.text}>Slug: {hackathonData.slug}</Text>
            </Card.Section>

            <Card.Section className={classes.borderSection}>
              <Text className={classes.title}>Set Hackathon Status</Text>
              {statusToggles}
            </Card.Section>

            <Card.Section className={classes.borderSection}>
              <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                <Text className={classes.title}>
                  Start Date: {new Date(hackathonData.startDate).toDateString()}
                </Text>
                <Text className={classes.title}>
                  End Date: {new Date(hackathonData.endDate).toDateString()}
                </Text>
              </SimpleGrid>
            </Card.Section>

            <Card.Section className={classes.borderSection}>
              <Text className={classes.title}>Description:</Text>
              <RichTextEditor
                readOnly
                value={hackathonData.description || ''}
                id='hackathonDescriptionEditor'
              />
            </Card.Section>

            <AllCategoryList hackathonID={hackathonData.id} />

            <AllParticipantList hackathonID={hackathonData.id} />

            <AllIdeaList hackathon={hackathonData} />

            <Card.Section className={classes.borderSection}>
              <Group position='left' mt='xl'>
                {deleteModal}
                <Button
                  style={{ backgroundColor: DELETE_BUTTON_COLOR }}
                  onClick={() => setDeleteModalOpened(true)}
                >
                  Delete
                </Button>
                {editModal}
                <Button
                  style={{ backgroundColor: JOIN_BUTTON_COLOR }}
                  onClick={() => setEditModalOpened(true)}
                >
                  Edit
                </Button>

                {isHackathonLoading && <div>Loading...</div>}
              </Group>
            </Card.Section>
          </Card>
        )}
    </>
  )
}
