import { Button, Card, Checkbox, Group, Textarea } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { showNotification, updateNotification } from '@mantine/notifications'
import { editUser, getUserDetails } from '../../actions/UserActions'
import { SkillPreview } from '../../common/types'
import { getListOfSkills } from '../../actions/SkillActions'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import { dark2, JOIN_BUTTON_COLOR } from '../../common/colors'
import { Check, X } from 'tabler-icons-react'

type IProps = {
  userId: string
  reload?: () => void
  setOpened?: (boolean: boolean) => void
}

export default function EditUserForm(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { userId, reload, setOpened } = props
  const [isLoading, setIsLoading] = useState(true)
  const [availableSkills, setAvailableSkills] = useState([] as SkillPreview[])
  const [skills, setSkills] = useState<string[]>([])
  const [user, setUser] = useState({
    id: '',
    lastName: '',
    firstName: '',
    emailAddress: '',
    roles: [],
    imageUrl: '',
  })

  const loadSelectedUser = () => {
    getUserDetails(instance, userId).then(
      (data) => {
        setIsLoading(false)
        setUser({
          id: userId,
          lastName: data.lastName,
          firstName: data.firstName,
          emailAddress: data.emailAddress,
          roles: data.roles,
          imageUrl: data.imageUrl,
        })
      },
      () => {
        setIsLoading(false)
      }
    )
  }

  useEffect(() => {
    loadSelectedUser()
    loadAvailableSkills()
    setIsLoading(true)
  }, [])

  function editThisUser(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'user-load',
      loading: true,
      title: `Editing ${user.firstName} ${user.lastName ? user.lastName : ''}`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    editUser(instance, user, skills).then((response) => {
      if (setOpened) {
        setOpened(false)
      }
      if (reload) {
        reload()
      }
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'user-load',
          color: 'red',
          title: 'Failed to edit user',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        updateNotification({
          id: 'user-load',
          color: 'teal',
          title: `Edited ${user.firstName} ${
            user.lastName ? user.lastName : ''
          }`,
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
      }
    })
  }

  function submitIsEnabled(): boolean {
    return !!user.firstName
  }

  const loadAvailableSkills = () => {
    getListOfSkills(instance).then((data) => {
      setAvailableSkills(data.skills)
    })
  }

  const skillsList = availableSkills.map((skill, index) => [
    <Checkbox value={skill.id} label={skill.name} key={index} />,
  ])

  return (
    <>
      {isLoading && (
        <div>
          <h3>User details are loading...</h3>
        </div>
      )}
      {!isLoading && (
        <Card withBorder className={classes.card}>
          <Card.Section className={classes.borderSection}>
            <Checkbox.Group
              label='Skills'
              onChange={setSkills}
              required
              className={classes.label}
            >
              {skillsList}
            </Checkbox.Group>
          </Card.Section>
          <Group position='right' mt='xl'>
            <Button
              style={{
                backgroundColor: submitIsEnabled() ? JOIN_BUTTON_COLOR : dark2,
              }}
              disabled={!submitIsEnabled()}
              onClick={editThisUser}
            >
              Edit
            </Button>
          </Group>
        </Card>
      )}
    </>
  )
}
