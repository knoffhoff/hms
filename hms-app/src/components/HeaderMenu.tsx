import React from 'react'
import { Link } from 'react-router-dom'
import {
  createStyles,
  Header,
  Menu,
  Group,
  Burger,
  Container,
  Avatar,
  useMantineColorScheme,
} from '@mantine/core'
import { useBooleanToggle } from '@mantine/hooks'
import { SwitchToggle } from './ThemeSwitchToggle'

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

  menu: {
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
  const [opened, toggleOpened] = useBooleanToggle(false)
  const { classes } = useStyles()

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
        <div className={classes.inner}>
          <h1>HMS</h1>
          <Group spacing={5} className={classes.links}>
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
