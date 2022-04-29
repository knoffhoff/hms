import {
  Textarea,
  Group,
  Button,
  CheckboxGroup,
  Checkbox,
  createStyles,
  Card,
  Text,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { CategoryPreview, Hackathon, SkillPreview } from '../common/types'
import { getListOfSkills } from '../actions/SkillActions'
import { getListOfCategories } from '../actions/CategoryActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon } from '@modulz/radix-icons'
import { createIdea } from '../actions/IdeaActions'

type IProps = {
  hackathon: Hackathon
  userId: string
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
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
}))

function NewIdea(props: IProps) {
  const { hackathon, userId } = props
  const { classes } = useStyles()
  const [availableSkills, setAvailableSkills] = useState({
    skills: [] as SkillPreview[],
  })
  const [skills, setSkills] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState({
    categories: [] as CategoryPreview[],
  })
  const [categories, setCategories] = useState<string[]>([])
  const [ideaText, setIdeaText] = useState({
    ownerId: userId.toString(),
    hackathonId: hackathon.hackathonId,
    title: '',
    description: '',
    problem: '',
    goal: '',
    creationDate: new Date(),
  })

  const loadAvailableSkills = () => {
    getListOfSkills().then((data) => {
      setAvailableSkills({
        ...availableSkills,
        skills: data.skills,
      })
    })
  }

  const skillsList = availableSkills.skills.map((skill, index) => [
    <Checkbox value={skill.id} label={skill.name} />,
  ])

  const loadAvailableCategories = () => {
    getListOfCategories(hackathon.hackathonId).then((data) => {
      setAvailableCategories({
        ...availableCategories,
        categories: data.categories,
      })
    })
  }

  const categoriesList = availableCategories.categories.map(
    (category, index) => [
      <Checkbox value={category.id} label={category.title} />,
    ]
  )

  useEffect(() => {
    loadAvailableSkills()
    loadAvailableCategories()
  }, [])

  useEffect(() => {
    loadAvailableCategories()
  }, [hackathon])

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setIdeaText((prevIdeaText) => ({
      ...prevIdeaText,
      hackathonId: hackathon.hackathonId,
      [event.target.name]: event.target.value,
    }))
  }

  function submitForm(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'idea-load',
      loading: true,
      title: 'Create idea',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })
    createIdea(ideaText, skills, categories).then((r) =>
      setTimeout(() => {
        updateNotification({
          id: 'idea-load',
          color: 'teal',
          title: 'Idea was created',
          message: 'Notification will close in 2 seconds',
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }, 3000)
    )
  }

  return (
    <>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section className={classes.section}>
          <Text mt="sm">hackathon: {hackathon.title}</Text>
        </Card.Section>
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
            label="Required skills"
            description="chose one or more required skills"
            spacing="md"
            onChange={setSkills}
            required
          >
            {skillsList}
          </CheckboxGroup>
        </Card.Section>
        <Card.Section className={classes.section}>
          <CheckboxGroup
            mt="sm"
            color="gray"
            label="Category"
            description="chose one or more categories"
            spacing="md"
            onChange={setCategories}
            required
          >
            {categoriesList}
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
