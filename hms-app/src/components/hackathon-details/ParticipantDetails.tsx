import React, { useState } from 'react'
import { User } from '../../common/types'
import { Button, Card, createStyles, Group, Modal, Text } from '@mantine/core'
import { deleteParticipant } from '../../actions/ParticipantActions'

type IProps = {
  participantID: string
  user: User
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

export default function ParticipantDetails(props: IProps) {
  const { classes } = useStyles()
  const { participantID, user } = props
  const [opened, setOpened] = useState(false)

  const deleteSelectedParticipant = () => {
    deleteParticipant(participantID).then((data) => {
      setOpened(false)
    })
  }

  return (
    <>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section className={classes.section}>
          <Text size="lg" mt="xs">
            {user.firstName} {user.lastName}
          </Text>
          <Text size={'sm'}>Participant ID: {participantID}</Text>
          <Text size={'sm'}>User ID: {user.id}</Text>
        </Card.Section>

        <Card.Section className={classes.section}>
          <Text mt="md" className={classes.label} color="dimmed">
            E-mail:
          </Text>
          <Text size="md" mt="xs">
            email needs to be added
          </Text>
        </Card.Section>

        <Card.Section className={classes.section}>
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
