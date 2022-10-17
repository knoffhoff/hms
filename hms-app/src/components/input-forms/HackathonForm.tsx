import { Textarea, Group, Button, Card, SimpleGrid, Title } from '@mantine/core'
import React, { useState } from 'react'
import { DatePicker } from '@mantine/dates'
import { createHackathon, editHackathon } from '../../actions/HackathonActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { styles } from '../../common/styles'
import { RichTextEditor } from '@mantine/rte'
import { useMsal } from '@azure/msal-react'
import { dark2, dark3, JOIN_BUTTON_COLOR } from '../../common/colors'

type IProps = { context: string; hackathonId: string | null }

function HackathonForm(props: IProps) {
  const { instance } = useMsal()
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
    if (startDateValue !== null && endDateValue !== null) {
      if (endDateValue <= startDateValue) {
        showNotification({
          id: 'hackathon-end-before-start',
          title: 'End date must be after start date',
          message: 'Please select a valid end date',
          autoClose: 5000,
          icon: <X />,
          color: 'red',
        })
      } else {
        showNotification({
          id: 'hackathon-load',
          loading: true,
          title: `Creating ${hackathonTitle}`,
          message: undefined,
          autoClose: false,
          disallowClose: false,
        })
        createHackathon(
          instance,
          hackathonTitle,
          DescriptionValue,
          startDateValue!,
          endDateValue!
        ).then((response) => {
          if (JSON.stringify(response).toString().includes('error')) {
            updateNotification({
              id: 'hackathon-load',
              color: 'red',
              title: 'Failed to create hackathon',
              message: undefined,
              icon: <X />,
              autoClose: 2000,
            })
          } else {
            updateNotification({
              id: 'hackathon-load',
              color: 'teal',
              title: `Created ${hackathonTitle}`,
              message: undefined,
              icon: <Check />,
              autoClose: 2000,
            })
          }
        })
      }
    }
  }

  function editThisHackathon(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'hackathon-load',
      loading: true,
      title: `Editing ${hackathonTitle}`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    editHackathon(
      instance,
      hackathonId!,
      hackathonTitle,
      DescriptionValue,
      startDateValue!,
      endDateValue!
    ).then((response) => {
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'hackathon-load',
          color: 'red',
          title: 'Failed to edit hackathon',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        updateNotification({
          id: 'hackathon-load',
          color: 'teal',
          title: `Edited ${hackathonTitle}`,
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
      }
    })
  }

  function submitIsEnabled(): boolean {
    return !!hackathonTitle
  }

  return (
    <>
      <Card withBorder className={classes.card}>
        <Card.Section className={classes.borderSection}>
          <Textarea
            label='Title'
            required
            placeholder='Title'
            maxRows={1}
            autosize
            onChange={handleChange}
            name='title'
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
              excludeDate={(date) => date < today}
              required
              className={classes.label}
            />
          </SimpleGrid>
        </Card.Section>

        <Card.Section className={classes.borderSection}>
          <Title className={classes.label} mb={5}>
            Description
          </Title>
          <RichTextEditor
            value={DescriptionValue}
            onChange={onChange}
            style={{ minHeight: 225 }}
          />
        </Card.Section>

        <Group position='right' mt='xl'>
          {context === 'edit' && (
            <Button
              style={{
                backgroundColor: submitIsEnabled() ? JOIN_BUTTON_COLOR : dark2,
              }}
              disabled={!submitIsEnabled()}
              onClick={editThisHackathon}
            >
              Edit
            </Button>
          )}
          {context === 'new' && (
            <Button
              style={{
                backgroundColor: submitIsEnabled() ? JOIN_BUTTON_COLOR : dark2,
              }}
              disabled={!submitIsEnabled()}
              onClick={createThisHackathon}
            >
              Create
            </Button>
          )}
        </Group>
      </Card>{' '}
    </>
  )
}

export default HackathonForm
