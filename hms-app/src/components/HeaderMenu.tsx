import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createStyles,
  Header,
  Menu,
  Group,
  Center,
  Burger,
  Container,
  Avatar,
  useMantineColorScheme,
} from '@mantine/core'
import { useBooleanToggle } from '@mantine/hooks'
import { ChevronDown } from 'tabler-icons-react'
import { SwitchToggle } from './ThemeSwitchToggle'
import { getListOfHackathons } from '../actions/HackathonActions'
import { HackathonPreview } from '../common/types'

const useStyles = createStyles((theme) => ({
  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}))

interface HeaderSearchProps {
  links: {
    link: string
    label: string
    links?: { link: string; label: string }[]
  }[]
}

export default function HeaderMenu({ links }: HeaderSearchProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'
  const [opened, toggleOpened] = useBooleanToggle(false)
  const { classes } = useStyles()

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

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ))

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          delay={0}
          transitionDuration={0}
          placement="end"
          gutter={1}
          control={
            <Link to={link.link} className={classes.link}>
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <ChevronDown size={12} />
              </Center>
            </Link>
          }
        >
          {menuItems}
        </Menu>
      )
    }

    return (
      <Link key={link.label} to={link.link} className={classes.link}>
        {link.label}
      </Link>
    )
  })

  return (
    <Header height={56}>
      <Container>
        <div className={classes.inner}>
          <h1>HMS</h1>
          <Group spacing={5} className={classes.links}>
            <SwitchToggle />
            {items}
            <Avatar color="indigo" radius="xl">
              JP
            </Avatar>
          </Group>
          <Menu
              delay={0}
              transitionDuration={0}
              placement="end"
              gutter={1}
              control={
                <Burger
                    opened={opened}
                    onClick={() => toggleOpened()}
                    className={classes.burger}
                    size="sm"
                />
              }>
            <Menu.Item>qwe</Menu.Item>
            <Menu.Item>qwe</Menu.Item>
            <Menu.Item>qwe</Menu.Item>
          </Menu>
        </div>
      </Container>
    </Header>
  )
}
