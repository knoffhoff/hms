import React from 'react'
import { Link } from 'react-router-dom'
import {
  Header,
  Menu,
  Group,
  Center,
  Burger,
  Container,
  Avatar,
} from '@mantine/core'
import { useBooleanToggle } from '@mantine/hooks'
import { ChevronDown } from 'tabler-icons-react'
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
        <div className={classes.header}>
          <h1>HMS</h1>
          <Group spacing={5} className={classes.headerLinks}>
            <SwitchToggle />
            {items}
            <Avatar color="indigo" radius="xl">
              JP
            </Avatar>
          </Group>
          <Burger
            opened={opened}
            onClick={() => toggleOpened()}
            className={classes.headerBurger}
            size="sm"
          />
        </div>
      </Container>
    </Header>
  )
}
