import { Textarea, Group, Button, Card, SimpleGrid } from '@mantine/core'
import React, { useState } from 'react'
import { DatePicker } from '@mantine/dates'
import { createHackathon, editHackathon } from '../../actions/HackathonActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon } from '@modulz/radix-icons'
import { styles } from '../../common/styles'
import { RichTextEditor } from '@mantine/rte'

type IProps = { context: string; hackathonId: string | null }

function HackathonForm(props: IProps) {
  const { context, hackathonId } = props
  const { classes } = styles()
  const today = new Date()
  const [startDateValue, setStartDateValue] = useState<Date | null>(new Date())
  const [endDateValue, setEndDateValue] = useState<Date | null>(new Date())
  const [hackathonTitle, setHackathonTitle] = useState('')
  const [DescriptionValue, onChange] = useState('')

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setHackathonTitle(event.target.value)
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
    createHackathon(
      hackathonTitle,
      DescriptionValue,
      startDateValue!,
      endDateValue!
    ).then((response) =>
      setTimeout(() => {
        console.log(response)
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
      hackathonId!,
      hackathonTitle,
      DescriptionValue,
      startDateValue!,
      endDateValue!
    ).then((response) =>
      setTimeout(() => {
        console.log(response)
        updateNotification({
          id: 'hackathon-load',
          color: 'teal',
          title: 'Hackathon was edited',
          message: 'Notification will close in 2 seconds',
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }, 3000)
    )
  }

  function submitIsEnabled(): boolean {
    return !!hackathonTitle
  }

  return (
    <>
      <Card withBorder className={classes.card}>
        <Card.Section className={classes.borderSection}>
          <Textarea
            label="Title"
            required
            placeholder="Title"
            maxRows={1}
            autosize
            onChange={handleChange}
            name="title"
            className={classes.label}
          />
        </Card.Section>
        <Card.Section className={classes.borderSection}>
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            <DatePicker
              label={'Start Date'}
              value={startDateValue}
              onChange={setStartDateValue}
              excludeDate={(date) => date < today}
              required
              className={classes.label}
            />
            <DatePicker
              label={'End Date'}
              value={endDateValue}
              onChange={setEndDateValue}
              excludeDate={(date) => date < startDateValue!}
              required
              className={classes.label}
            />
          </SimpleGrid>
        </Card.Section>

        <Card.Section className={classes.borderSection}>
          <RichTextEditor value={DescriptionValue} onChange={onChange} />
        </Card.Section>

        <Group position="right" mt="xl">
          {context === 'edit' && (
            <Button disabled={!submitIsEnabled()} onClick={editThisHackathon}>
              Edit
            </Button>
          )}
          {context === 'new' && (
            <Button disabled={!submitIsEnabled()} onClick={createThisHackathon}>
              Create
            </Button>
          )}
        </Group>
      </Card>{' '}
    </>
  )
}

export default HackathonForm
