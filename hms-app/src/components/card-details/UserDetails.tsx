import { deleteUser, getUserDetails } from '../../actions/UserActions'
import React, { useEffect, useState } from 'react'
import { User } from '../../common/types'
import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Text,
  useMantineTheme,
} from '@mantine/core'
import EditUserForm from '../input-forms/EditUserForm'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import {
  DELETE_BUTTON_COLOR,
  JOIN_BUTTON_COLOR,
  RELOAD_BUTTON_COLOR,
} from '../../common/colors'

export default function UserDetails(props: { userId: string }) {
  const { instance } = useMsal()
  const theme = useMantineTheme()
  const { classes } = styles()
  const { userId } = props
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [editModalOpened, setEditModalOpened] = useState(false)
  const [isUserError, setIsUserError] = useState(false)
  const [isUserLoading, setIsUserLoading] = useState(true)
  const [user, setUser] = useState({
    id: 'string',
    lastName: 'string',
    firstName: 'string',
    emailAddress: 'string',
    roles: [],
    skills: [],
    imageUrl: 'string',
    creationDate: new Date(),
  } as User)

  const loadSelectedUser = () => {
    setIsUserLoading(true)
    getUserDetails(instance, userId).then(
      (data) => {
        setUser(data)
        setIsUserLoading(false)
        setIsUserError(false)
      },
      () => {
        setIsUserLoading(false)
        setIsUserError(true)
      }
    )
  }

  const deleteSelectedUser = () => {
    deleteUser(instance, userId).then(() => {
      setDeleteModalOpened(false)
    })
  }

  useEffect(() => {
    loadSelectedUser()
  }, [userId])

  const deleteModal = (
    <Modal
      centered
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.text}>
        Are you sure you want to delete this user?
      </Text>
      <Text className={classes.title}>
        Name: {user.firstName} {user.lastName}
      </Text>
      <Text className={classes.title}>E-mail: {user.emailAddress}</Text>
      <Button
        style={{ backgroundColor: DELETE_BUTTON_COLOR }}
        onClick={() => deleteSelectedUser()}
      >
        Yes delete this user
      </Button>
      <Text className={classes.text}>
        (This window will automatically closed as soon as the user is deleted)
      </Text>
    </Modal>
  )

  const editModal = (
    <Modal
      centered
      opened={editModalOpened}
      onClose={() => setEditModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.title}>Edit User</Text>
      <EditUserForm userId={userId} />
      {isUserLoading && <div>Loading...</div>}
      <Text className={classes.text}>
        (This window will automatically close as soon as the user is edited)
      </Text>
    </Modal>
  )

  return (
    <>
      {isUserError && !isUserLoading && (
        <div>
          <Text className={classes.title}>Error loading user</Text>
          <Text className={classes.text}>something went wrong.</Text>
        </div>
      )}
      {isUserLoading && !isUserError && (
        <div>
          <Text className={classes.title}>User details are loading...</Text>
        </div>
      )}

      {!isUserLoading && !isUserError && (
        <Card withBorder className={classes.card}>
          <Card.Section className={classes.borderSection}>
            <Text className={classes.label}>Name</Text>
            <Text className={classes.text}>
              {user.firstName} {user.lastName}
            </Text>
            <Text size={'xs'}>User ID: {user.id}</Text>
            <Text size={'xs'}>
              Creation Date: {user.creationDate?.toString()}
            </Text>
          </Card.Section>

          <Card.Section className={classes.borderSection}>
            <Text className={classes.label}>E-mail</Text>
            <Text className={classes.text}>{user.emailAddress}</Text>
          </Card.Section>

          <Card.Section className={classes.borderSection}>
            <Text className={classes.label}>Roles</Text>
            <Group spacing={7} mt={5}>
              {user.roles?.map((role, index) => (
                <Badge
                  color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                  key={index}
                >
                  {role}
                </Badge>
              ))}
            </Group>
          </Card.Section>

          <Card.Section className={classes.borderSection}>
            <Text className={classes.label}>Skills</Text>
            <Group spacing={7} mt={5}>
              {user.skills?.map((skill, index) => (
                <Badge
                  color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                  key={index}
                >
                  {skill.name}
                </Badge>
              ))}
            </Group>
          </Card.Section>

          <Card.Section className={classes.borderSection}>
            <Group position='left' mt='xl'>
              {deleteModal}
              <Button
                style={{ backgroundColor: DELETE_BUTTON_COLOR }}
                onClick={() => setDeleteModalOpened(true)}
              >
                Delete
              </Button>
              {editModal}
              <Button
                style={{ backgroundColor: JOIN_BUTTON_COLOR }}
                onClick={() => setEditModalOpened(true)}
              >
                Edit
              </Button>
              <Button
                style={{ backgroundColor: RELOAD_BUTTON_COLOR }}
                onClick={() => loadSelectedUser()}
              >
                Reload
              </Button>
            </Group>
          </Card.Section>
        </Card>
      )}
    </>
  )
}
