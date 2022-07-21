import React, { useState } from 'react'
import { UserPreview } from '../../common/types'
import { Button, Card, Group, Modal, Text } from '@mantine/core'
import { deleteParticipant } from '../../actions/ParticipantActions'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'

type IProps = {
  participantId: string
  user: UserPreview
}

export default function ParticipantDetails(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { participantId, user } = props
  const [opened, setOpened] = useState(false)

  const deleteSelectedParticipant = () => {
    deleteParticipant(instance, participantId).then(() => {
      setOpened(false)
    })
  }

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
          <Text className={classes.text}>email needs to be added</Text>
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
            <Button color={'red'} onClick={() => deleteSelectedParticipant()}>
              Yes delete this participant
            </Button>
            <Text className={classes.text}>
              (This window will automatically close as soon as the participant
              is deleted)
            </Text>
          </Modal>

          <Group position='left' mt='xl'>
            <Button color={'red'} onClick={() => setOpened(true)}>
              Delete
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </>
  )
}
