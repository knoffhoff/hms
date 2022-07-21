import {
  Textarea,
  Group,
  Button,
  Card,
  CheckboxGroup,
  Checkbox,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon } from '@modulz/radix-icons'
import { editUser, getUserDetails } from '../../actions/UserActions'
import { SkillPreview } from '../../common/types'
import { getListOfSkills } from '../../actions/SkillActions'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'

type IProps = {
  userId: string
}

export default function EditUserForm(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { userId } = props
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

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setUser((prevUser) => ({
      ...prevUser,
      [event.target.name]: event.target.value,
    }))
  }

  function editThisUser(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'user-load',
      loading: true,
      title: 'User is uploading',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })
    editUser(instance, user, skills).then(() =>
      setTimeout(() => {
        updateNotification({
          id: 'user-load',
          color: 'teal',
          title: 'User was added',
          message: 'Notification will close in 2 seconds',
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }, 3000)
    )
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
            <Textarea
              label='First Name'
              required
              placeholder='First Name'
              maxRows={1}
              autosize
              onChange={handleChange}
              name='First Name'
              value={user.firstName}
              className={classes.label}
            />
          </Card.Section>
          <Card.Section className={classes.borderSection}>
            <Textarea
              label='Last Name'
              placeholder='Last Name'
              maxRows={1}
              autosize
              onChange={handleChange}
              name='Last Name'
              value={user.lastName}
              className={classes.label}
            />
          </Card.Section>
          <Card.Section className={classes.borderSection}>
            <Textarea
              label='E-mail'
              placeholder='E-mail'
              maxRows={1}
              autosize
              onChange={handleChange}
              name='E-mail'
              value={user.emailAddress}
              className={classes.label}
            />
          </Card.Section>
          <Card.Section className={classes.borderSection}>
            <CheckboxGroup
              label='Skills'
              onChange={setSkills}
              required
              className={classes.label}
            >
              {skillsList}
            </CheckboxGroup>
          </Card.Section>
          <Group position='right' mt='xl'>
            <Button disabled={!submitIsEnabled()} onClick={editThisUser}>
              Edit
            </Button>
          </Group>
        </Card>
      )}
    </>
  )
}
