import {
  Textarea,
  Group,
  Button,
  CheckboxGroup,
  Checkbox,
  Card,
  Text,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import {
  CategoryPreview,
  HackathonPreview,
  Idea,
  SkillPreview,
} from '../../common/types'
import { getListOfSkills } from '../../actions/SkillActions'
import { getListOfCategories } from '../../actions/CategoryActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon } from '@modulz/radix-icons'
import { createIdea, editIdea } from '../../actions/IdeaActions'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'

type IProps = {
  hackathon: HackathonPreview
  participantId: string
  context: string
  ideaId: string | null
  setOpened?: (boolean: boolean) => void
  idea?: Idea
}

function IdeaForm(props: IProps) {
  const { instance } = useMsal()
  const { hackathon, participantId, context, ideaId, setOpened, idea } = props
  const { classes } = styles()
  const [isLoading, setIsLoading] = useState(true)
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false)
  const [availableSkills, setAvailableSkills] = useState({
    skills: [] as SkillPreview[],
  })
  const [skills, setSkills] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState({
    categories: [] as CategoryPreview[],
  })
  const [categories, setCategories] = useState<string[]>([])
  const [ideaText, setIdeaText] = useState({
    ownerId: participantId,
    hackathonId: hackathon.id,
    title: '',
    description: '',
    problem: '',
    goal: '',
    creationDate: new Date(),
  })
  const allowedIdeaTitleLength = 100

  const setIdea = () => {
    if (idea) {
      setIdeaText({
        ...ideaText,
        title: idea.title,
        description: idea.description,
        problem: idea.problem,
        goal: idea.goal,
      })
    }
  }

  const loadAvailableSkills = () => {
    getListOfSkills(instance).then((data) => {
      setAvailableSkills({
        ...availableSkills,
        skills: data.skills,
      })
    })
  }

  const loadAvailableCategories = () => {
    getListOfCategories(instance, hackathon.id).then((data) => {
      setAvailableCategories({
        ...availableCategories,
        categories: data.categories,
      })
      setIsLoading(false)
    })
  }

  const skillsList = availableSkills.skills.map((skill) => [
    <Checkbox value={skill.id} label={skill.name} key={skill.id} />,
  ])

  const categoriesList = availableCategories?.categories?.map((category) => [
    <Checkbox value={category.id} label={category.title} key={category.id} />,
  ])

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setIdeaText((prevIdeaText) => ({
      ...prevIdeaText,
      hackathonId: hackathon.id,
      [event.target.name]: event.target.value,
    }))
    ideaText.title.length > allowedIdeaTitleLength
      ? setButtonIsDisabled(true)
      : setButtonIsDisabled(false)
  }

  function createThisIdea(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setButtonIsDisabled(true)
    showNotification({
      id: 'idea-load',
      loading: true,
      title: 'Create idea',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })
    createIdea(instance, ideaText, skills, categories).then((r) =>
      setTimeout(() => {
        console.log('r', r)
        setButtonIsDisabled(false)
        setCategories([])
        setSkills([])
        setIdeaText((prevState) => ({
          ...prevState,
          title: '',
          description: '',
          problem: '',
          goal: '',
        }))
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

  function editThisIdea(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setButtonIsDisabled(true)
    showNotification({
      id: 'idea-load',
      loading: true,
      title: 'Edit idea',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })
    editIdea(instance, ideaId!, ideaText, skills, categories).then((r) =>
      setTimeout(() => {
        setButtonIsDisabled(false)
        if (setOpened) {
          setOpened(false)
        }
        console.log(r)
        updateNotification({
          id: 'idea-load',
          color: 'teal',
          title: 'Idea was Edited',
          message: 'Notification will close in 2 seconds',
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }, 3000)
    )
  }

  useEffect(() => {
    loadAvailableSkills()
    loadAvailableCategories()
    setIdea()
    setCategories([])
    setSkills([])
  }, [])

  useEffect(() => {
    setIdeaText((prevIdeaText) => ({
      ...prevIdeaText,
      ownerId: participantId.toString(),
    }))
  }, [participantId])

  useEffect(() => {
    loadAvailableCategories()
  }, [hackathon])

  return (
    <>
      <Card withBorder className={classes.card}>
        {isLoading && <div>Loading relevant data...</div>}
        {!isLoading && (
          <div>
            <Card.Section className={classes.borderSection}>
              <Text className={classes.title}>
                Hackathon: {hackathon.title}
              </Text>
            </Card.Section>
            <Card.Section className={classes.borderSection}>
              <Textarea
                label='Title'
                required
                error={
                  ideaText.title.length > allowedIdeaTitleLength
                    ? 'max ' + allowedIdeaTitleLength + ' chars'
                    : false
                }
                placeholder='Title'
                maxRows={1}
                autosize
                onChange={handleChange}
                name='title'
                value={ideaText.title}
                className={classes.label}
              />
            </Card.Section>
            <Card.Section className={classes.borderSection}>
              <Textarea
                label='Description'
                required
                placeholder='Description'
                minRows={2}
                maxRows={3}
                autosize
                onChange={handleChange}
                name='description'
                value={ideaText.description}
                className={classes.label}
              />
            </Card.Section>
            <Card.Section className={classes.borderSection}>
              <Textarea
                label='Problem'
                placeholder='which problelm does it solve (optional)'
                minRows={2}
                maxRows={3}
                autosize
                onChange={handleChange}
                name='problem'
                value={ideaText.problem}
                className={classes.label}
              />
            </Card.Section>
            <Card.Section className={classes.borderSection}>
              <Textarea
                label='Goal'
                placeholder='the goal for the hackweek is... (optional)'
                minRows={2}
                maxRows={3}
                autosize
                onChange={handleChange}
                name='goal'
                value={ideaText.goal}
                className={classes.label}
              />
            </Card.Section>

            <>
              <Card.Section className={classes.borderSection}>
                <CheckboxGroup
                  label='Required skills'
                  description='chose one or more required skills'
                  onChange={setSkills}
                  required
                  value={skills}
                  className={classes.label}
                >
                  {skillsList}
                </CheckboxGroup>
              </Card.Section>
              <Card.Section className={classes.borderSection}>
                <CheckboxGroup
                  label='Category'
                  description='chose one or more categories'
                  onChange={setCategories}
                  required
                  value={categories}
                  className={classes.label}
                >
                  {categoriesList}
                </CheckboxGroup>
              </Card.Section>

              <Group position='right' mt='xl'>
                {context === 'edit' && (
                  <Button disabled={buttonIsDisabled} onClick={editThisIdea}>
                    Edit
                  </Button>
                )}
                {context === 'new' && (
                  <Button disabled={buttonIsDisabled} onClick={createThisIdea}>
                    Create
                  </Button>
                )}
              </Group>
            </>
          </div>
        )}
      </Card>
    </>
  )
}

export default IdeaForm
