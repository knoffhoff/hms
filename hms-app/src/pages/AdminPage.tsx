import React, { useEffect, useState } from 'react'
import { createHackathon } from '../actions/GetBackendData'
import {
  Button,
  Card,
  createStyles,
  Group,
  Select,
  SimpleGrid,
  Textarea,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'

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

function AdminPage() {
  const { classes } = useStyles()
  const today = new Date()
  const [startDateValue, setStartDateValue] = useState<Date | null>(new Date())
  const [endDateValue, setEndDateValue] = useState<Date | null>(new Date())
  const [hackathonText, setHackathonText] = useState({
    title: '',
    startDate: '',
    endDate: '',
  })

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setHackathonText((prevHackathonText) => ({
      ...prevHackathonText,
      [event.target.name]: event.target.value,
    }))
  }

  function submitForm(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    console.log('hackathon text after submit button', hackathonText)
  }

  useEffect(() => {
    setHackathonText((prevHackathonText) => ({
      ...prevHackathonText,
      startDate: startDateValue!.toDateString(),
      endDate: endDateValue!.toDateString(),
    }))
  }, [endDateValue])

  return (
    <>
      <h1>Hello Admin </h1>
      <h2>Nice to see you</h2>

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
              label={'Start date'}
              value={startDateValue}
              onChange={setStartDateValue}
              excludeDate={(date) => date.getDate() < today.getDate()}
              required
            />
            <DatePicker
              label={'End date'}
              value={endDateValue}
              onChange={setEndDateValue}
              excludeDate={(date) => date.getDate() < startDateValue!.getDate()}
              required
            />
          </SimpleGrid>
        </Card.Section>
        <Group position="right" mt="xl">
          <Button onClick={submitForm}>Submit hackathon</Button>
        </Group>
      </Card>
    </>
  )
}

export default AdminPage
