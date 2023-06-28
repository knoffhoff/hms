import React, { useEffect, useState } from 'react'
import { Button, Card, Group, Textarea } from '@mantine/core'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useMsal } from '@azure/msal-react'
import { CustomCheckIcon, CustomXIcon } from '../../components/NotificationIcons'

import {
  addSkill,
  editSkill,
  getSkillDetails,
} from '../../actions/SkillActions'
import { dark2, JOIN_BUTTON_COLOR } from '../../common/colors'
import { styles } from '../../common/styles'

type IProps = {
  skillId: string
  context: 'edit' | 'new'
  onSuccess: () => void
}

const SkillForm = (props: IProps): React.ReactElement => {
  const { instance } = useMsal()
  const { classes } = styles()
  const { skillId, context, onSuccess } = props
  const [isLoading, setIsLoading] = useState(true)
  const [skill, setSkill] = useState({
    id: skillId,
    name: '',
    description: '',
  })

  const loadSelectedSkill = (): void => {
    if (skillId) {
      getSkillDetails(instance, skillId).then(
        (data) => {
          setSkill(data)
          setIsLoading(false)
        },
        () => {
          setIsLoading(false)
        }
      )
    } else {
      // new skill
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSelectedSkill()
  }, [])

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setSkill((prevSkillState) => ({
      ...prevSkillState,
      [event.target.name]: event.target.value,
    }))
  }

  const editThisSkill = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault()
    showNotification({
      id: 'skill-load',
      loading: true,
      title: `Editing ${skill.name}`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    editSkill(instance, skill).then((response) => {
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'skill-load',
          color: 'red',
          title: 'Failed to edit skill',
          message: undefined,
          icon: <CustomXIcon />,
          autoClose: 5000,
        })
      } else {
        updateNotification({
          id: 'skill-load',
          color: 'teal',
          title: `Edited ${skill.name}`,
          message: undefined,
          icon: <CustomCheckIcon />,
          autoClose: 5000,
        })
        onSuccess()
      }
    })
  }

  function clearForm() {
    setSkill((prevState) => ({
      ...prevState,
      name: '',
      description: '',
    }))
  }

  const createThisSkill = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault()
    showNotification({
      id: 'skill-load',
      loading: true,
      title: `Creating ${skill.name}`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    addSkill(instance, skill).then((response) => {
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'skill-load',
          color: 'red',
          title: 'Failed to create skill',
          message: undefined,
          icon: <CustomXIcon />,
          autoClose: 5000,
        })
      } else {
        updateNotification({
          id: 'skill-load',
          color: 'teal',
          title: `Created ${skill.name}`,
          message: undefined,
          icon: <CustomCheckIcon />,
          autoClose: 5000,
        })
        onSuccess()
        clearForm()
      }
    })
  }

  const submitIsEnabled = (): boolean => {
    return !!skill.name
  }

  return (
    <>
      {isLoading && (
        <div>
          <h3>Skill details are loading...</h3>
        </div>
      )}
      {!isLoading && (
        <Card withBorder className={classes.card}>
          <Card.Section className={classes.borderSection}>
            <Textarea
              label='Name'
              required
              placeholder='Name'
              maxRows={1}
              autosize
              onChange={handleChange}
              name='name'
              value={skill.name}
              className={classes.label}
            />
          </Card.Section>
          <Card.Section className={classes.borderSection}>
            <Textarea
              label='Description'
              required
              placeholder='Description'
              maxRows={1}
              autosize
              onChange={handleChange}
              name='description'
              value={skill.description}
              className={classes.label}
            />
          </Card.Section>
          <Group position='right' mt='xl'>
            {context === 'edit' && (
              <Button
                style={{
                  backgroundColor: submitIsEnabled()
                    ? JOIN_BUTTON_COLOR
                    : dark2,
                }}
                disabled={!submitIsEnabled()}
                onClick={editThisSkill}
              >
                Save
              </Button>
            )}
            {context === 'new' && (
              <Button
                style={{
                  backgroundColor: submitIsEnabled()
                    ? JOIN_BUTTON_COLOR
                    : dark2,
                }}
                disabled={!submitIsEnabled()}
                onClick={createThisSkill}
              >
                Create
              </Button>
            )}
          </Group>
        </Card>
      )}
    </>
  )
}

export default SkillForm
