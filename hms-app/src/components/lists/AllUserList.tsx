import { Group, Button, Card, Accordion } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { UserPreview } from '../../common/types'
import { getListOfUsers } from '../../actions/UserActions'
import UserDetails from '../card-details/UserDetails'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'

export default function AllUserList() {
  const { instance } = useMsal()
  const { classes } = styles()
  const [isLoading, setIsLoading] = useState(true)
  const [userList, setUserList] = useState({
    users: [] as UserPreview[],
  })

  const loadUsers = () => {
    getListOfUsers(instance).then((data) => {
      setIsLoading(false)
      setUserList({
        users: data.users,
      })
    })
  }

  const allUsers = userList.users.map((user, index) => [
    <Accordion.Item key={user.id} value={user.id}>
      <Accordion.Control>
        {index + 1}. {user.firstName} {user.lastName}
      </Accordion.Control>
      <Accordion.Panel>
        <UserDetails userId={user.id} />
      </Accordion.Panel>
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
      <Card withBorder className={classes.card}>
        <Card.Section className={classes.borderSection}>
          <Group position='left' mt='xl'>
            {!isLoading && <Button onClick={refreshList}>Refresh list</Button>}
            {isLoading && <div>Loading...</div>}
          </Group>
        </Card.Section>
        <Card.Section>
          <Accordion chevronPosition={'right'}>{allUsers}</Accordion>
        </Card.Section>
      </Card>{' '}
    </>
  )
}
