import {
  Textarea,
  Group,
  Button,
  createStyles,
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

type IProps = {
  userID: string
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

export default function EditUserForm(props: IProps) {
  const { classes } = useStyles()
  const { userID } = props
  const [isError, setIsError] = useState(false)
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
    getUserDetails(userID).then(
      (data) => {
        setIsError(false)
        setIsLoading(false)
        setUser({
          id: userID,
          lastName: data.lastName,
          firstName: data.firstName,
          emailAddress: data.emailAddress,
          roles: data.roles,
          imageUrl: data.imageUrl,
        })
      },
      () => {
        setIsError(true)
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
    editUser(user, skills).then((r) =>
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
    getListOfSkills().then((data) => {
      setAvailableSkills(data.skills)
    })
  }

  const skillsList = availableSkills.map((skill) => [
    <Checkbox value={skill.id} label={skill.name} />,
  ])

  return (
    <>
      {isLoading && (
        <div>
          <h3>User details are loading...</h3>
        </div>
      )}
      {!isLoading && (
        <Card withBorder radius="md" p="md" className={classes.card}>
          <Card.Section className={classes.section}>
            <Textarea
              label="First Name"
              mt="sm"
              required
              placeholder="First Name"
              maxRows={1}
              autosize
              onChange={handleChange}
              name="First Name"
              value={user.firstName}
            />
          </Card.Section>
          <Card.Section className={classes.section}>
            <Textarea
              label="Last Name"
              mt="sm"
              placeholder="Last Name"
              maxRows={1}
              autosize
              onChange={handleChange}
              name="Last Name"
              value={user.lastName}
            />
          </Card.Section>
          <Card.Section className={classes.section}>
            <Textarea
              label="E-mail"
              mt="sm"
              placeholder="E-mail"
              maxRows={1}
              autosize
              onChange={handleChange}
              name="E-mail"
              value={user.emailAddress}
            />
          </Card.Section>
          <Card.Section className={classes.section}>
            <CheckboxGroup
              mt="sm"
              color="gray"
              label="Skills"
              spacing="md"
              onChange={setSkills}
              required
            >
              {skillsList}
            </CheckboxGroup>
          </Card.Section>
          <Group position="right" mt="xl">
            <Button disabled={!submitIsEnabled()} onClick={editThisUser}>
              Edit
            </Button>
          </Group>
        </Card>
      )}
    </>
  )
}
