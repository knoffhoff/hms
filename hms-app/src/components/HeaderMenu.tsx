import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Avatar,
  Burger,
  Button,
  Container,
  Group,
  Header,
  Image,
  Menu,
  Text,
  useMantineColorScheme,
  Popover,
  Badge,
  Modal,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { SwitchToggle } from './ThemeSwitchToggle'
import { styles } from '../common/styles'
import {
  HEADER_ACTIVE_COLOR_DARK,
  HEADER_ACTIVE_COLOR_LIGHT,
  JOIN_BUTTON_COLOR,
  PRIMARY_COLOR_1,
} from '../common/colors'
import { useMsal } from '@azure/msal-react'
import { Logout } from 'tabler-icons-react'
import { getProfilePhoto } from '../common/actionAuth'
import { LOGO } from '../common/constants'
import { User } from '../common/types'
import EditUserForm from './input-forms/EditUserForm'
import { getUserDetails } from '../actions/UserActions'

interface HeaderSearchProps {
  links: {
    link: string
    label: string
  }[]
  hackathonLinks: {
    link: string
    label: string
  }[]
  adminLinks: {
    link: string
    label: string
  }[]
  userDetails: User
}

const AZURE_ACCOUNT_ID = process.env.REACT_APP_AZURE_ACCOUNT_ID || ''
const AZURE_REDIRECT_URL = process.env.REACT_APP_AZURE_REDIRECT_URL || ''

export default function HeaderMenu({
  links,
  hackathonLinks,
  adminLinks,
  userDetails,
}: HeaderSearchProps) {
  const theme = useMantineColorScheme()
  const [profilePhoto, setProfilePhoto] = useState('')
  const [opened, handlers] = useDisclosure(false)
  const { classes } = styles()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const location = useLocation()
  const { instance } = useMsal()
  const [editModalOpened, setEditModalOpened] = useState(false)
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
  const [isUserError, setIsUserError] = useState(false)
  const [isUserLoading, setIsUserLoading] = useState(true)

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      const profilePhoto = await getProfilePhoto(instance)
      setProfilePhoto(URL.createObjectURL(profilePhoto))
    }
    fetchProfilePhoto()
  }, [instance])

  const loadSelectedUser = () => {
    setIsUserLoading(true)
    getUserDetails(instance, userDetails.id).then(
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

  useEffect(() => {
    loadSelectedUser()
  }, [])

  const logout = () => {
    const logoutRequest = {
      account: instance.getAccountByHomeId(AZURE_ACCOUNT_ID),
      postLogoutRedirectUri: AZURE_REDIRECT_URL,
    }
    instance.logoutRedirect(logoutRequest)
  }

  function getInitials(name: string) {
    const names = name.split(' ')
    const initials = names.map((name) => name[0]).join('')
    return initials
  }

  const fullscreenMenu = (
    <Group spacing={5}>
      {links.map((link) => (
        <div key={link.link}>
          <Link
            key={link.label}
            to={link.link}
            className={classes.link}
            style={{
              backgroundColor:
                location.pathname.slice(1) === link.link
                  ? theme.colorScheme === 'light'
                    ? HEADER_ACTIVE_COLOR_LIGHT
                    : HEADER_ACTIVE_COLOR_DARK
                  : undefined,
            }}
          >
            {link.label}
          </Link>
        </div>
      ))}
      <Menu>
        <Menu.Target>
          <Text className={classes.link}>Hackathons</Text>
        </Menu.Target>

        <Menu.Dropdown
          style={{
            backgroundColor:
              theme.colorScheme === 'light' ? PRIMARY_COLOR_1 : PRIMARY_COLOR_1,
          }}
        >
          {hackathonLinks.map((link) => (
            <Menu.Item
              key={link.label}
              component={Link}
              to={link.link}
              className={classes.link}
              style={{
                backgroundColor:
                  location.pathname.slice(1) === link.link
                    ? theme.colorScheme === 'light'
                      ? HEADER_ACTIVE_COLOR_LIGHT
                      : HEADER_ACTIVE_COLOR_DARK
                    : undefined,
              }}
            >
              {link.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
      {adminLinks.map((link) => (
        <div key={link.link}>
          <Link
            key={link.label}
            to={link.link}
            className={classes.link}
            style={{
              backgroundColor:
                location.pathname.slice(1) === link.link
                  ? theme.colorScheme === 'light'
                    ? HEADER_ACTIVE_COLOR_LIGHT
                    : HEADER_ACTIVE_COLOR_DARK
                  : undefined,
            }}
          >
            {link.label}
          </Link>
        </div>
      ))}
    </Group>
  )

  const smallScreenMenu = (
    <div className={classes.headerBurger}>
      <Menu opened={opened}>
        <Menu.Target>
          <Burger opened={opened} onClick={() => handlers.toggle()} size='sm' />
        </Menu.Target>
        <Menu.Dropdown>
          {links.map((link) => (
            <Menu.Item key={link.label} component={Link} to={link.link}>
              {link.label}
            </Menu.Item>
          ))}
          <Menu.Divider />
          {hackathonLinks.map((link) => (
            <Menu.Item key={link.label} component={Link} to={link.link}>
              {link.label}
            </Menu.Item>
          ))}
          <Menu.Divider />
          {adminLinks.map((link) => (
            <div key={link.link}>
              <Link key={link.label} to={link.link} className={classes.link}>
                {link.label}
              </Link>
            </div>
          ))}
          <SwitchToggle />
        </Menu.Dropdown>
      </Menu>
    </div>
  )

  const refreshAfterChange = () => {
    setEditModalOpened(false)
    loadSelectedUser()
  }

  const editModal = (
    <Modal
      centered
      opened={editModalOpened}
      onClose={() => setEditModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.title}>Edit User</Text>
      <EditUserForm user={user} onSuccess={refreshAfterChange} />
      <Text className={classes.text}>
        (This window will automatically close as soon as the user is edited)
      </Text>
    </Modal>
  )

  const popoverProfile = (
    <Popover width='200' position='bottom' withArrow shadow='md'>
      <Popover.Target>
        <Button
          style={{
            backgroundColor:
              theme.colorScheme === 'light' ? PRIMARY_COLOR_1 : PRIMARY_COLOR_1,
            padding: '0px 0px 0px 10px',
            height: 40,
          }}
        >
          {userAvatar(profilePhoto)}
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        {!isUserLoading && isUserError && (
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
          <div>
            <Text size='sm'>
              Name: {userDetails?.firstName} {userDetails?.lastName}
            </Text>

            <Text size='sm'>Email: {userDetails?.emailAddress}</Text>

            <Text size='sm'>
              Roles:{' '}
              {userDetails.roles?.map((role, index) => (
                <Badge
                  color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                  key={index}
                >
                  {role}
                </Badge>
              ))}
            </Text>

            <Text size='sm'>
              Skills:{' '}
              {user.skills?.map((skill, index) => (
                <Badge
                  color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                  key={index}
                >
                  {skill.name}
                </Badge>
              ))}
            </Text>

            <Group position='right' mt='xs'>
              <Button
                style={{ backgroundColor: JOIN_BUTTON_COLOR }}
                onClick={() => setEditModalOpened(true)}
              >
                Edit
              </Button>
            </Group>
          </div>
        )}
      </Popover.Dropdown>
    </Popover>
  )

  function userAvatar(profilePhoto: string | null | undefined) {
    if (profilePhoto) {
      return <Avatar src={profilePhoto} radius={'xl'} />
    }
    if (!profilePhoto) {
      const fullName = userDetails?.firstName + ' ' + userDetails?.lastName
      return (
        <Avatar color='indigo' radius='xl'>
          {getInitials(fullName ?? 'User User')}
        </Avatar>
      )
    }
  }

  return (
    <Header
      height={56}
      style={{
        backgroundColor:
          theme.colorScheme === 'light' ? PRIMARY_COLOR_1 : PRIMARY_COLOR_1,
      }}
    >
      <Container size={1300}>
        <div className={classes.header}>
          <Group spacing={10}>
            <Link to={'/'}>
              <Image height={40} width={120} src={LOGO} />{' '}
            </Link>
            <h1 className={classes.headerHeadline}>Ideation Portal</h1>
          </Group>
          <Group spacing={5} className={classes.headerLinks}>
            <SwitchToggle />
            {fullscreenMenu}
            {editModal}
            {popoverProfile}
            <Button onClick={logout} variant={'subtle'}>
              <Logout />
            </Button>
            <p></p>
          </Group>
          {smallScreenMenu}
        </div>
      </Container>
    </Header>
  )
}
