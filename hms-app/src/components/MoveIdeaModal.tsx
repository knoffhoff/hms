import {
  CategoryPreview,
  HackathonDropdownMode,
  Idea,
  SkillPreview,
} from '../common/types'
import {
  Button,
  Card,
  Checkbox,
  Modal,
  Radio,
  Text,
  Title,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import HackathonSelectDropdown from './HackathonSelectDropdown'
import { ArrowDown, Check, X } from 'tabler-icons-react'
import { useMsal } from '@azure/msal-react'
import { getListOfSkills } from '../actions/SkillActions'
import { getListOfCategories } from '../actions/CategoryActions'
import { styles } from '../common/styles'
import { showNotification, updateNotification } from '@mantine/notifications'
import { editIdea } from '../actions/IdeaActions'

type IProps = {
  idea: Idea
}

export default function MoveIdeaModal({ idea }: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const [opened, setOpened] = useState(false)
  const [buttonIsDisabled, setButtonIsDisabled] = useState(true)
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [availableSkills, setAvailableSkills] = useState({
    skills: [] as SkillPreview[],
  })
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    idea?.requiredSkills?.map((skill) => skill.id) || []
  )
  const [availableCategories, setAvailableCategories] = useState({
    categories: [] as CategoryPreview[],
  })
  const [selectedCategory, setSelectedCategory] = useState<string>(
    idea?.category?.id || ''
  )
  const [ideaText, setIdeaText] = useState({
    ownerId: idea.owner?.id || '',
    hackathonId: idea.hackathon?.id || '',
    title: idea.title || '',
    description: idea.description || '',
    problem: idea.problem || '',
    goal: idea.goal || '',
    creationDate: idea.creationDate || new Date(),
  })

  const loadAvailableSkills = () => {
    getListOfSkills(instance).then((data) => {
      let skills = [] as SkillPreview[]
      if (data && data.skills) {
        skills = data.skills
      }
      setAvailableSkills({
        ...availableSkills,
        skills,
      })
    })
  }

  const loadAvailableCategories = () => {
    if (selectedHackathonId !== '') {
      getListOfCategories(instance, selectedHackathonId).then((data) => {
        setAvailableCategories({
          ...availableCategories,
          categories: data.categories,
        })
      })
    }
  }

  const skillsList = availableSkills.skills.map((skill) => [
    <Checkbox value={skill.id} label={skill.name} key={skill.id} />,
  ])

  const categoriesList = availableCategories?.categories?.map((category) => [
    <Radio value={category.id} label={category.title} key={category.id} />,
  ])

  function editThisIdea(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    setButtonIsDisabled(true)
    showNotification({
      id: 'idea-load',
      loading: true,
      title: `Moving "${ideaText.title}"`,
      message: undefined,
      autoClose: false,
    })
    editIdea(instance, idea.id, ideaText, selectedSkills, [
      selectedCategory,
    ]).then((response) => {
      setButtonIsDisabled(false)
      if (setOpened) {
        setOpened(false)
      }
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'idea-load',
          color: 'red',
          title: 'Failed to Move idea',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        updateNotification({
          id: 'idea-load',
          color: 'teal',
          title: `Moved "${ideaText.title}"`,
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
      }
    })
  }

  useEffect(() => {
    loadAvailableSkills()
    loadAvailableCategories()
    setSelectedCategory('')
    setSelectedSkills([])
  }, [])

  useEffect(() => {
    loadAvailableSkills()
    loadAvailableCategories()
    setIdeaText({
      ...ideaText,
      hackathonId: selectedHackathonId,
    })
  }, [selectedHackathonId])

  useEffect(() => {
    if (selectedCategory && selectedSkills.length > 0) {
      setButtonIsDisabled(false)
    }
  }, [selectedSkills, selectedCategory])

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} size={800}>
        <Title align={'center'} mb={20}>
          Move Idea to another Hackathon
        </Title>

        <Text size={'lg'}>Select the target hackathon here</Text>
        <ArrowDown size={'50px'} />
        <HackathonSelectDropdown
          setHackathonId={setSelectedHackathonId}
          context={HackathonDropdownMode.IdeaPortal}
        />

        <Text size={'lg'}>Select Required Skills and a Category here</Text>
        <ArrowDown size={'50px'} />
        <>
          <Card.Section className={classes.borderSection}>
            <Checkbox.Group
              label='Required skills'
              description='chose one or more required skills'
              onChange={setSelectedSkills}
              required
              defaultValue={idea?.requiredSkills?.map((skill) => skill.id)}
              value={selectedSkills}
              className={classes.label}
            >
              {skillsList}
            </Checkbox.Group>
          </Card.Section>
          <Card.Section className={classes.borderSection}>
            <Radio.Group
              label='Category'
              description='chose one category'
              onChange={setSelectedCategory}
              required
              defaultValue={idea?.category?.id}
              value={selectedCategory}
              className={classes.label}
            >
              {categoriesList}
            </Radio.Group>
          </Card.Section>
        </>
        <Text size={'lg'}>Submit your changes here</Text>
        <ArrowDown size={'50px'} />
        <Button
          disabled={buttonIsDisabled}
          onClick={editThisIdea}
          color='green'
          size='lg'
        >
          Move Idea
        </Button>
      </Modal>

      <Button onClick={() => setOpened(true)} color={'yellow'}>
        Move idea to Hackathon
      </Button>
    </>
  )
}
