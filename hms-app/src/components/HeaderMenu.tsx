import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Header,
  Menu,
  Group,
  Burger,
  Container,
  Avatar,
} from '@mantine/core'
import { useBooleanToggle } from '@mantine/hooks'
import { SwitchToggle } from './ThemeSwitchToggle'
import { styles } from '../common/styles'

interface HeaderSearchProps {
  links: {
    link: string
    label: string
    links?: { link: string; label: string }[]
  }[]
}

export default function HeaderMenu({ links }: HeaderSearchProps) {
  const [opened, toggleOpened] = useBooleanToggle(false)
  const { classes } = styles()

  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonList, setHackathonList] = useState<HackathonPreview[]>([])
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const loadHackathons = () => {
    getListOfHackathons().then(
      (data) => {
        localStorage.setItem('hackathonList', JSON.stringify(data))
        setHackathonList(data)
        setIsLoading(false)
        setIsError(false)
      },
      () => {
        setIsError(true)
        setIsLoading(false)
      }
    )
  }

  const getNextHackathon = hackathonList.find((hackathon) => {
    return new Date(hackathon.startDate) > today
  })

  useEffect(() => {
    if (!!getNextHackathon) {
      localStorage.setItem('nextHackathon', JSON.stringify(getNextHackathon))
    }
  }, [hackathonList])

  useEffect(() => {
    loadHackathons()
  }, [])

  const fullscreenMenu = links.map((link) => {
    return (
      <Link key={link.label} to={link.link} className={classes.link}>
        {link.label}
      </Link>
    )
  })

  const smallScreenMenu = (
    <Menu
      opened={opened}
      className={classes.menu}
      control={
        <Burger opened={opened} onClick={() => toggleOpened()} size="sm" />
      }
    >
      {links.map((link) => (
        <Menu.Item component={Link} to={link.link}>
          {link.label}
        </Menu.Item>
      ))}
      <SwitchToggle />
    </Menu>
  )

  return (
    <Header height={56}>
      <Container>
        <div className={classes.header}>
          <h1>HMS</h1>
          <Group spacing={5} className={classes.headerLinks}>
            <SwitchToggle />
            {fullscreenMenu}
            <Avatar color="indigo" radius="xl">
              JP
            </Avatar>
          </Group>
          {smallScreenMenu}
        </div>
      </Container>
    </Header>
  )
}
