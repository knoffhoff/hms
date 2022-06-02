import React, { useState } from 'react'
import { UserPreview } from '../../common/types'
import { Button, Card, Group, Modal, Text } from '@mantine/core'
import { deleteParticipant } from '../../actions/ParticipantActions'
import { styles } from '../../common/styles'

type IProps = {
  participantId: string
  user: UserPreview
}

export default function ParticipantDetails(props: IProps) {
  const { classes } = styles()
  const { participantId, user } = props
  const [opened, setOpened] = useState(false)

  const deleteSelectedParticipant = () => {
    deleteParticipant(participantId).then((data) => {
      setOpened(false)
    })
  }

  return (
    <>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section className={classes.borderSection}>
          <Text size="lg" mt="xs">
            {user.firstName} {user.lastName}
          </Text>
          <Text size={'sm'}>Participant ID: {participantId}</Text>
          <Text size={'sm'}>User ID: {user.id}</Text>
        </Card.Section>

        <Card.Section className={classes.borderSection}>
          <Text mt="md" className={classes.label} color="dimmed">
            E-mail:
          </Text>
          <Text size="md" mt="xs">
            email needs to be added
          </Text>
        </Card.Section>

        <Card.Section className={classes.borderSection}>
          <Modal
            centered
            opened={opened}
            onClose={() => setOpened(false)}
            withCloseButton={false}
          >
            Are you sure you want to delete this participant?
            <h4>
              {user.firstName} {user.lastName}
            </h4>
            <Button color={'red'} onClick={() => deleteSelectedParticipant()}>
              Yes delete this participant
            </Button>
            <p>
              (This window will automatically close as soon as the participant
              is deleted)
            </p>
          </Modal>
          <Group position="left" mt="xl">
            <Button color={'red'} onClick={() => setOpened(true)}>
              Delete
            </Button>
          </Group>
        </Card.Section>
      </Card>
    </>
  )
}
