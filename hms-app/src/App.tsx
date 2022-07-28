import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import './App.css'
import Home from './pages/Home'
import IdeaPortal from './pages/IdeaPortal'
import MyIdeas from './pages/MyIdeas'
import Archive from './pages/Archive'
import NoPage from './pages/NoPage'
import Voting from './pages/Voting'
import AdminPage from './pages/AdminPage'
import Presentations from './pages/Presentations'
import { useAppSelector } from './hooks'
import { User } from './common/types'
import { UserSerializable } from './common/redux/userSlice'

function App() {
  const stateUser = useAppSelector((state) => state.user.user)
  const isAdmin = (user: UserSerializable) => {
    return user && user.roles && user.roles.includes('Admin')
  }

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='ideas' element={<IdeaPortal />} />
        <Route path='my-ideas' element={<MyIdeas />} />
        {isAdmin(stateUser) && (
          <>
            <Route path='archive' element={<Archive />} />
            <Route path='voting' element={<Voting />} />
            <Route path='admin' element={<AdminPage />} />
          </>
        )}
        <Route path='*' element={<NoPage />} />
      </Route>
      <Route path={'presentations'} element={<Presentations />} />
    </Routes>
  )
}

export default App
