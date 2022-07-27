import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Image,
  Header,
  Menu,
  Group,
  Burger,
  Container,
  Avatar,
  Button,
  useMantineColorScheme,
} from '@mantine/core'
import { useBooleanToggle } from '@mantine/hooks'
import { SwitchToggle } from './ThemeSwitchToggle'
import { styles } from '../common/styles'
import {
  HEADER_ACTIVE_COLOR_LIGHT,
  HEADER_ACTIVE_COLOR_DARK,
  PRIMARY_COLOR_1,
  TEXT_COLOR_WHITE,
  PRIMARY_COLOR_2,
} from '../common/colors'
import { useMsal } from '@azure/msal-react'
import { Logout } from 'tabler-icons-react'
import { getProfilePhoto } from '../common/actionAuth'
import { LOGO } from '../common/constants'

interface HeaderSearchProps {
  links: {
    link: string
    label: string
    links?: { link: string; label: string }[]
  }[]
}

const AZURE_ACCOUNT_ID = process.env.REACT_APP_AZURE_ACCOUNT_ID || ''
const AZURE_REDIRECT_URL = process.env.REACT_APP_AZURE_REDIRECT_URL || ''

export default function HeaderMenu({ links }: HeaderSearchProps) {
  const theme = useMantineColorScheme()
  const [profilePhoto, setProfilePhoto] = useState('')
  const [opened, toggleOpened] = useBooleanToggle(false)
  const { classes } = styles()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const location = useLocation()
  const { instance, accounts } = useMsal()
  const user = accounts.length > 0 ? accounts[0] : null

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      const profilePhoto = await getProfilePhoto(instance)
      setProfilePhoto(URL.createObjectURL(profilePhoto))
    }
    fetchProfilePhoto()
  }, [instance])

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

  const fullscreenMenu = links.map((link) => {
    return (
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
    )
  })

  const smallScreenMenu = (
    <Menu
      opened={opened}
      className={classes.headerBurger}
      control={
        <Burger opened={opened} onClick={() => toggleOpened()} size='sm' />
      }
    >
      {links.map((link) => (
        <Menu.Item key={link.label} component={Link} to={link.link}>
          {link.label}
        </Menu.Item>
      ))}
      <SwitchToggle />
    </Menu>
  )

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
          <Group spacing={1}>
            <Image height={56} mt={30} src={LOGO} caption={'LOGO'} />{' '}
            <h1 style={{ color: TEXT_COLOR_WHITE }}>Hackweek</h1>
          </Group>
          <Group spacing={5} className={classes.headerLinks}>
            <SwitchToggle />
            {fullscreenMenu}
            {profilePhoto && <Avatar src={profilePhoto} radius={'xl'} />}
            {!profilePhoto && (
              <Avatar color='indigo' radius='xl'>
                {getInitials(user?.name ?? 'User User')}
              </Avatar>
            )}
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
