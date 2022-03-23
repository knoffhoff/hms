import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppShell, Container } from '@mantine/core'
import HeaderMenu from '../components/HeaderMenu'

const menuLinks = [
  { link: 'home', label: 'Home' },
  {
    link: 'idea-portal',
    label: 'Idea Portal',
  },
  { link: 'your-ideas', label: 'Your Ideas' },
  {
    link: 'archive',
    label: 'Archive',
    links: [
      { link: 'dec-2021', label: 'Dec 2021' },
      { link: 'jun-2021', label: 'Jun 2021' },
    ],
  },
  {
    link: 'admin',
    label: 'Admin',
    links: [{ link: 'manage-ideas', label: 'Manage Ideas' }],
  },
]

const Layout = () => {
  return (
    <AppShell
      header={<HeaderMenu links={menuLinks} />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          minHeight: 'calc(100vh - 56px)',
        },
      })}
    >
      <Container size={'xl'}>
        <Outlet />
      </Container>
    </AppShell>
  )
}

export default Layout
