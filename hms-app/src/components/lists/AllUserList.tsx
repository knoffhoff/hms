import { Group, Button, createStyles, Card, Accordion } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { UserPreview } from '../../common/types'
import { getListOfUsers } from '../../actions/UserActions'
import UserDetails from '../card-details/UserDetails'

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
}))

export default function AllUserList() {
  const { classes } = useStyles()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userList, setUserList] = useState({
    users: [] as UserPreview[],
  })

  const loadUsers = () => {
    getListOfUsers().then(
      (data) => {
        setIsError(false)
        setIsLoading(false)
        setUserList({
          users: data.users,
        })
      },
      () => {
        setIsError(true)
      }
    )
  }

  const allUsers = userList.users.map((user, index) => [
    <Accordion.Item
      label={
        <div>
          {index + 1}. {user.firstName} {user.lastName}
        </div>
      }
    >
      <UserDetails userId={user.id} />
    </Accordion.Item>,
  ])

  useEffect(() => {
    loadUsers()
  }, [])

  function refreshList() {
    setIsLoading(true)
    loadUsers()
  }

  return (
    <>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section className={classes.section}>
          <Group position="left" mt="xl">
            {!isLoading && <Button onClick={refreshList}>Refresh list</Button>}
            {isLoading && <div>Loading...</div>}
          </Group>
        </Card.Section>
        <Card.Section>
          <Accordion iconPosition="right">{allUsers}</Accordion>
        </Card.Section>
      </Card>{' '}
    </>
  )
}
