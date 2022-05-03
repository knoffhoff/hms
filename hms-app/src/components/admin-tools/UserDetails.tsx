import { deleteUser, getUserDetails } from '../../actions/UserActions'
import React, { useEffect, useState } from 'react'
import { User } from '../../common/types'
import {
  Accordion,
  Badge,
  Button,
  Card,
  createStyles,
  Group,
  Modal,
  Text,
  useMantineTheme,
} from '@mantine/core'
import HackathonForm from './HackathonForm'
import UserForm from './UserForm'

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
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}))

export default function UserDetails(props: { userID: string }) {
  const theme = useMantineTheme()
  const { classes } = useStyles()
  const { userID } = props
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
    getUserDetails(userID).then(
      (data) => {
        setUser({
          id: data.id,
          lastName: data.lastName,
          firstName: data.firstName,
          emailAddress: data.emailAddress,
          roles: data.roles,
          skills: data.skills,
          imageUrl: data.imageUrl,
          creationDate: data.creationDate,
        })
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
    deleteUser(userID).then((data) => {
      setDeleteModalOpened(false)
    })
  }

  useEffect(() => {
    loadSelectedUser()
    setIsUserLoading(true)
  }, [userID])

  const deleteModal = (
    <Modal
      centered
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
      withCloseButton={false}
    >
      Are you sure you want to delete this user?
      <h4>
        Name: {user.firstName} {user.lastName}
      </h4>
      <h4>E-mail: {user.emailAddress}</h4>
      <Button color={'red'} onClick={() => deleteSelectedUser()}>
        Yes delete this user
      </Button>
      <p>
        (This window will automatically closed as soon as the hackathon is
        deleted)
      </p>
    </Modal>
  )

  const editModal = (
    <Modal
      centered
      opened={editModalOpened}
      onClose={() => setEditModalOpened(false)}
      withCloseButton={false}
    >
      Edit User
      <UserForm contextID={userID} />
      {isUserLoading && <div>Loading...</div>}
      <p>
        (This window will automatically close as soon as the category is
        deleted)
      </p>
    </Modal>
  )

  return (
    <>
      {isUserError && (
        <div>
          <h3>Error loading hackathons</h3>
          <p>something went wrong.</p>
        </div>
      )}
      {isUserLoading && (
        <div>
          <h3>User details are loading...</h3>
        </div>
      )}

      {!isUserLoading && !isUserError && (
        <Card withBorder radius="md" p="md" className={classes.card}>
          <Card.Section className={classes.section}>
            <Text mt="md" className={classes.label} color="dimmed">
              Name
            </Text>
            <Text size="md" mt="xs">
              {user.firstName} {user.lastName}
            </Text>
            <Text size={'xs'}>ID: {user.id}</Text>
            <Text size={'xs'}>
              Creation Date: {user.creationDate?.toString()}
            </Text>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Text mt="md" className={classes.label} color="dimmed">
              E-mail
            </Text>
            <Text size={'md'}>{user.emailAddress}</Text>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Text mt="md" className={classes.label} color="dimmed">
              Roles
            </Text>
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

          <Card.Section className={classes.section}>
            <Text mt="md" className={classes.label} color="dimmed">
              Skills
            </Text>
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

          <Card.Section className={classes.section}>
            <Group position="left" mt="xl">
              {deleteModal}
              <Button color={'red'} onClick={() => setDeleteModalOpened(true)}>
                Delete
              </Button>
              {editModal}
              <Button onClick={() => setEditModalOpened(true)}>Edit</Button>
              {!isUserLoading && (
                <Button color={'green'} onClick={() => loadSelectedUser()}>
                  Reload
                </Button>
              )}
              {isUserLoading && <div>Loading...</div>}
            </Group>
          </Card.Section>
        </Card>
      )}
    </>
  )
}
