import { Button, Card, Checkbox, Group } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { showNotification, updateNotification } from '@mantine/notifications'
import { editUser } from '../../actions/UserActions'
import { SkillPreview, User } from '../../common/types'
import { getListOfSkills } from '../../actions/SkillActions'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import { dark2, JOIN_BUTTON_COLOR } from '../../common/colors'
import { CustomCheckIcon, CustomXIcon } from '../NotificationIcons'

type IProps = {
  onSuccess: () => void
  user: User
}

export default function EditUserForm(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { user, onSuccess } = props
  const [isLoading, setIsLoading] = useState(true)
  const [availableSkills, setAvailableSkills] = useState([] as SkillPreview[])
  const [skills, setSkills] = useState<string[]>([])
  const userData = {
    id: user.id,
    lastName: user.lastName ? user.lastName : '',
    firstName: user.firstName,
    emailAddress: user.emailAddress,
    roles: user.roles,
    imageUrl: user.imageUrl ? user.imageUrl : '',
  }

  useEffect(() => {
    setIsLoading(true)
    loadAvailableSkills()
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
    editUser(instance, userData, skills).then((response) => {
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'user-load',
          color: 'red',
          title: 'Failed to edit user',
          message: undefined,
          icon: <CustomXIcon />,
          autoClose: 5000,
        })
      } else {
        updateNotification({
          id: 'user-load',
          color: 'teal',
          title: `Edited ${user.firstName} ${
            user.lastName ? user.lastName : ''
          }`,
          message: undefined,
          icon: <CustomCheckIcon />,
          autoClose: 5000,
        })
        onSuccess()
      }
    })
  }

  function submitIsEnabled(): boolean {
    return !!user.firstName
  }

  const loadAvailableSkills = () => {
    getListOfSkills(instance).then((data) => {
      setIsLoading(false)
      setAvailableSkills(data.skills)
    })
  }

  const skillsList = availableSkills.map((skill, index) => [
    <Checkbox value={skill.id} label={skill.name} key={index} />,
  ])

  const userSkill = user.skills?.map((skill) => skill.id)

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
              defaultValue={userSkill}
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
              Save
            </Button>
          </Group>
        </Card>
      )}
    </>
  )
}
