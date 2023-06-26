import { CategoryPreview, HackathonDropdownMode, Idea } from '../common/types'
import {
  Button,
  Card,
  Flex,
  Group,
  Modal,
  Radio,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import HackathonSelectDropdown from './HackathonSelectDropdown'
import { ArrowDown, Check, X, ArrowBigRight, Tool } from 'tabler-icons-react'
import { useMsal } from '@azure/msal-react'
import { getListOfCategories } from '../actions/CategoryActions'
import { styles } from '../common/styles'
import { showNotification, updateNotification } from '@mantine/notifications'
import { editIdea } from '../actions/IdeaActions'
import { removeIdeaParticipant } from '../actions/ParticipantActions'
import { JOIN_BUTTON_COLOR } from '../common/colors'

type IProps = {
  idea: Idea
  onSuccess: () => void
}

export default function MoveIdeaModal(props: IProps) {
  const { idea, onSuccess } = props
  const { instance } = useMsal()
  const { classes } = styles()
  const [opened, setOpened] = useState(false)
  const [categoryIsDisabled, setCategoryIsDisabled] = useState(true)
  const [buttonIsDisabled, setButtonIsDisabled] = useState(true)
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
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

  const categoriesList = availableCategories?.categories?.map((category) => [
    <Radio value={category.id} label={category.title} key={category.id} />,
  ])

  const mapSkills = idea.requiredSkills
    ? idea.requiredSkills.map((skill) => skill.id)
    : []

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
    editIdea(instance, idea.id, ideaText, mapSkills, [selectedCategory]).then(
      (response) => {
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
          removeIdeaParticipants(idea).then((r) => {
            if (JSON.stringify(r).toString().includes('error')) {
              updateNotification({
                id: 'idea-load',
                color: 'red',
                title: 'Failed to delete idea participants',
                message: undefined,
                icon: <X />,
                autoClose: 2000,
              })
            }
          })
          updateNotification({
            id: 'idea-load',
            color: 'teal',
            title: `Moved "${ideaText.title}"`,
            message: undefined,
            icon: <Check />,
            autoClose: 2000,
          })
          onSuccess()
        }
      }
    )
  }

  async function removeIdeaParticipants(idea: Idea) {
    const participants = idea.participants
    if (participants) {
      participants.forEach((participant) => {
        removeIdeaParticipant(instance, idea.id, participant.id)
      })
    }
  }

  useEffect(() => {
    loadAvailableCategories()
    setSelectedCategory('')
  }, [])

  useEffect(() => {
    setSelectedHackathonId('')
    setSelectedCategory('')
    setAvailableCategories({
      categories: [] as CategoryPreview[],
    })
  }, [opened === false])

  useEffect(() => {
    loadAvailableCategories()
    setIdeaText({
      ...ideaText,
      hackathonId: selectedHackathonId,
    })
  }, [selectedHackathonId])

  useEffect(() => {
    if (selectedCategory) {
      setButtonIsDisabled(false)
    } else {
      setButtonIsDisabled(true)
    }
  }, [selectedCategory])

  const modalTitle = () => {
    return (
      <Title align={'center'} order={3}>
        Move Idea to Another Hackathon
      </Title>
    )
  }



  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size={800}
        title={modalTitle()}
        centered
      >
        <HackathonSelectDropdown
          setHackathonId={setSelectedHackathonId}
          context={HackathonDropdownMode.MoveModal}
        />

        <Stack>
          {selectedHackathonId !== '' && <Radio.Group
            mb={30}
            label='Select Category'
            description='Choose one hackathon category for your idea'
            onChange={setSelectedCategory}
            required
            defaultValue={idea?.category?.id}
            value={selectedCategory}
            // className={classes.label}
          >
            {categoriesList}
          </Radio.Group>
            }
          

          {buttonIsDisabled ? (
            <Tooltip
              label='Select a hackathon and category first'
              color='orange'
              withArrow
              arrowPosition='center'
            >
              <Button
                data-disabled
                sx={{ '&[data-disabled]': { pointerEvents: 'all' } }}
                onClick={(event) => event.preventDefault()}
              >
                Move Idea
              </Button>
            </Tooltip>
          ) : (
            <Button onClick={editThisIdea} color='green' size='md'>
              Move Idea
            </Button>
          )}
        </Stack>
      </Modal>

      <Button
        size='xs'
        onClick={() => setOpened(true)}
        color={JOIN_BUTTON_COLOR}
      >
        Move Idea
        <ArrowBigRight size={20} style={{ marginLeft: 3 }} />
      </Button>
    </>
  )
}
