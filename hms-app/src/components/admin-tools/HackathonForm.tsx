import {
  Textarea,
  Group,
  Button,
  createStyles,
  Card,
  SimpleGrid,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { DatePicker } from '@mantine/dates'
import { createHackathon, editHackathon } from '../../actions/HackathonActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon } from '@modulz/radix-icons'

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
}))

type IProps = { context: string; hackathonID: string | null }

function HackathonForm(props: IProps) {
  const { context, hackathonID } = props
  const { classes } = useStyles()
  const today = new Date()
  const [startDateValue, setStartDateValue] = useState<Date | null>(new Date())
  const [endDateValue, setEndDateValue] = useState<Date | null>(new Date())
  const [hackathonText, setHackathonText] = useState({
    title: '',
  })

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setHackathonText((prevHackathonText) => ({
      ...prevHackathonText,
      [event.target.name]: event.target.value,
    }))
  }

  function createThisHackathon(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'hackathon-load',
      loading: true,
      title: 'Hackathon is uploading',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })

    createHackathon(hackathonText.title, startDateValue!, endDateValue!).then(
      (r) =>
        setTimeout(() => {
          updateNotification({
            id: 'hackathon-load',
            color: 'teal',
            title: 'Hackathon was created',
            message: 'Notification will close in 2 seconds',
            icon: <CheckIcon />,
            autoClose: 2000,
          })
        }, 3000)
    )
  }

  function editThisHackathon(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'hackathon-load',
      loading: true,
      title: 'Hackathon is uploading',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })

    editHackathon(
      hackathonID!,
      hackathonText.title,
      startDateValue!,
      endDateValue!
    ).then((r) =>
      setTimeout(() => {
        updateNotification({
          id: 'hackathon-load',
          color: 'teal',
          title: 'Hackathon was created',
          message: 'Notification will close in 2 seconds',
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }, 3000)
    )
  }

  function submitIsEnabled(): boolean {
    return !!hackathonText.title
  }

  return (
    <>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section className={classes.section}>
          <Textarea
            label="Title"
            mt="sm"
            required
            placeholder="Title"
            maxRows={1}
            autosize
            onChange={handleChange}
            name="title"
          />
        </Card.Section>
        <Card.Section className={classes.section}>
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            <DatePicker
              label={'Start Date'}
              value={startDateValue}
              onChange={setStartDateValue}
              excludeDate={(date) => date < today}
              required
            />
            <DatePicker
              label={'End Date'}
              value={endDateValue}
              onChange={setEndDateValue}
              excludeDate={(date) => date < startDateValue!}
              required
            />
          </SimpleGrid>
        </Card.Section>
        <Group position="right" mt="xl">
          {context === 'edit' && (
            <Button disabled={!submitIsEnabled()} onClick={editThisHackathon}>
              Submit category
            </Button>
          )}
          {context === 'new' && (
            <Button disabled={!submitIsEnabled()} onClick={createThisHackathon}>
              Submit category
            </Button>
          )}
        </Group>
      </Card>{' '}
    </>
  )
}

export default HackathonForm
