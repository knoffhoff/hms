import {
  Textarea,
  Group,
  Button,
  useMantineTheme,
  CheckboxGroup,
  Checkbox,
  createStyles,
  Card,
} from '@mantine/core'
import React, { useState } from 'react'

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

function NewIdea() {
  const { classes } = useStyles()
  const [skills, setSkills] = useState<string[]>([])
  const [ideaText, setIdeaText] = useState({
    title: '',
    description: '',
    reason: '',
    problem: '',
    goal: '',
  })

  function handleChange(event: { target: { name: any; value: any } }) {
    setIdeaText((prevIdeaText) => ({
      ...prevIdeaText,
      [event.target.name]: event.target.value,
    }))
  }

  function submitForm(event: any) {
    event.preventDefault()
    alert(JSON.stringify(ideaText) + 'skills: ' + JSON.stringify(skills))
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
          <Textarea
            mt="sm"
            label="Description"
            required
            placeholder="Description"
            minRows={2}
            maxRows={3}
            autosize
            onChange={handleChange}
            name="description"
          />
        </Card.Section>
        <Card.Section className={classes.section}>
          <Textarea
            label="Reason"
            mt="sm"
            placeholder="Descripe how you got this idea (optional)"
            minRows={2}
            maxRows={3}
            autosize
            onChange={handleChange}
            name="reason"
          />
        </Card.Section>
        <Card.Section className={classes.section}>
          <Textarea
            label="Problem"
            mt="sm"
            placeholder="which problelm does it solve (optional)"
            minRows={2}
            maxRows={3}
            autosize
            onChange={handleChange}
            name="problem"
          />
        </Card.Section>
        <Card.Section className={classes.section}>
          <Textarea
            label="Goal"
            mt="sm"
            placeholder="the goal for the hackweek is... (optional)"
            minRows={2}
            maxRows={3}
            autosize
            onChange={handleChange}
            name="goal"
          />
        </Card.Section>
        <Card.Section className={classes.section}>
          <CheckboxGroup
            mt="sm"
            color="gray"
            label="Skills"
            description="chose one or more needed skills"
            spacing="md"
            onChange={setSkills}
          >
            <Checkbox value="frontend" label="frontend" />
            <Checkbox value="backend" label="backend" />
            <Checkbox value="design" label="design" />
            <Checkbox value="infrastructure" label="infrastructure" />
            <Checkbox value="aws" label="aws" />
          </CheckboxGroup>
        </Card.Section>

        <Group position="right" mt="xl">
          <Button onClick={submitForm}>Submit idea</Button>
        </Group>
      </Card>
    </>
  )
}

export default NewIdea
