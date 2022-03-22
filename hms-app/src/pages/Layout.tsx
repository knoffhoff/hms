import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderMenu from '../components/HeaderMenu'

const Layout = () => {
  return (
    <div>
      <HeaderMenu
        links={[
          { link: 'home', label: 'Home' },
          { link: 'ideaPortal', label: 'Idea Portal' },
          { link: 'yourIdeas', label: 'Your Ideas' },
          {
            link: 'archive',
            label: 'Archive',
            links: [
              { link: 'Dec 2021', label: 'Dec 2021' },
              { link: 'Jun 2021', label: 'Jun 2021' },
            ],
          },
          {
            link: 'admin',
            label: 'Admin',
            links: [{ link: 'Manage Ideas', label: 'Manage Ideas' }],
          },
        ]}
      />
      <Outlet />
    </div>
  )
}

export default Layout
