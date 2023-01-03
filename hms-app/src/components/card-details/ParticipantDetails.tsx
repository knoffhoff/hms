import React, { useEffect, useState } from 'react'
import { User, UserPreview } from '../../common/types'
import { Button, Card, Group, Modal, Text } from '@mantine/core'
import { deleteParticipant } from '../../actions/ParticipantActions'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import { DELETE_BUTTON_COLOR } from '../../common/colors'
import { getUserDetails } from '../../actions/UserActions'

type IProps = {
  participantId: string
  user: UserPreview
}

export default function ParticipantDetails(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { participantId, user } = props
  const [opened, setOpened] = useState(false)
  const [userDetails, setUserDetails] = useState({} as User)

  const loadUserDetails = () => {
    if (user.id !== '') {
      getUserDetails(instance, user.id).then((data) => {
        setUserDetails(data)
      })
    }
  }

  const deleteSelectedParticipant = () => {
    deleteParticipant(instance, participantId).then(() => {
      setOpened(false)
    })
  }

  useEffect(() => {
    loadUserDetails()
  }, [participantId])

  return (
    <>
      <Card withBorder className={classes.card}>
        <Card.Section className={classes.borderSection}>
          <Text className={classes.title}>
            {user.firstName} {user.lastName}
          </Text>
          <Text className={classes.text}>Participant ID: {participantId}</Text>
          <Text className={classes.text}>User ID: {user.id}</Text>
        </Card.Section>

        <Card.Section className={classes.borderSection}>
          <Text className={classes.label}>E-mail:</Text>
          <Text className={classes.text}>{userDetails.emailAddress}</Text>
        </Card.Section>

        <Card.Section className={classes.borderSection}>
          <Modal
            centered
            opened={opened}
            onClose={() => setOpened(false)}
            withCloseButton={false}
          >
            <Text className={classes.text}>
              Are you sure you want to delete this participant?
            </Text>
            <Text className={classes.title}>
              {user.firstName} {user.lastName}
            </Text>
            <Button
              style={{ backgroundColor: DELETE_BUTTON_COLOR }}
              onClick={() => deleteSelectedParticipant()}
            >
              Yes delete this participant
            </Button>
            <Text className={classes.text}>
              (This window will automatically close as soon as the participant
              is deleted)
            </Text>
          </Modal>

          <Group position='left' mt='xl'>
            <Button
              style={{ backgroundColor: DELETE_BUTTON_COLOR }}
              onClick={() => setOpened(true)}
            >
              Delete
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </>
  )
}
