import { Textarea, Group, Button, Card, SimpleGrid } from '@mantine/core'
import React, { useState } from 'react'
import { DatePicker } from '@mantine/dates'
import { createHackathon, editHackathon } from '../../actions/HackathonActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon, Cross2Icon } from '@modulz/radix-icons'
import { styles } from '../../common/styles'
import { RichTextEditor } from '@mantine/rte'
import { useMsal } from '@azure/msal-react'
import { dark2, dark3, JOIN_BUTTON_COLOR } from '../../common/colors'
import { X } from 'tabler-icons-react'

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
          title: 'Hackathon is uploading',
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
        ).then((response) =>
          setTimeout(() => {
            console.log(response)
            if (JSON.stringify(response).toString().includes('error')) {
              updateNotification({
                id: 'participant-load',
                color: 'red',
                title: 'Failed to create Hackathon',
                message: undefined,
                icon: <Cross2Icon />,
                autoClose: 2000,
              })
            } else {
              updateNotification({
                id: 'participant-load',
                color: 'teal',
                title: 'Hackathon was created',
                message: undefined,
                icon: <CheckIcon />,
                autoClose: 2000,
              })
            }
          }, 3000)
        )
      }
    }
  }

  function editThisHackathon(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'hackathon-load',
      loading: true,
      title: 'Hackathon is uploading',
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
    ).then((response) =>
      setTimeout(() => {
        console.log(response)
        if (JSON.stringify(response).toString().includes('error')) {
          updateNotification({
            id: 'participant-load',
            color: 'red',
            title: 'Failed to Edit Hackathon',
            message: undefined,
            icon: <Cross2Icon />,
            autoClose: 2000,
          })
        } else {
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: 'Hackathon was Edited',
            message: undefined,
            icon: <CheckIcon />,
            autoClose: 2000,
          })
        }
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
          <RichTextEditor value={DescriptionValue} onChange={onChange} />
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
