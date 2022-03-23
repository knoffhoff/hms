import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderMenu from '../components/HeaderMenu'

const Layout = () => {
  return (
    <div>
      <HeaderMenu
        links={[
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
        ]}
      />
      <Outlet />
    </div>
  )
}

export default Layout
