import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import './App.css'
import Home from './pages/Home'
import AllIdeas from './pages/AllIdeas'
import MyIdeas from './pages/MyIdeas'
import Archive from './pages/Archive'
import NoPage from './pages/NoPage'
import Voting from './pages/Voting'
import Admin from './pages/Admin'
import Presentations from './pages/Presentations'
import { useAppSelector } from './hooks'
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
        <Route path='ideas' element={<AllIdeas />} />
        <Route path='my-ideas' element={<MyIdeas />} />
        {isAdmin(stateUser) && (
          <>
            <Route path='archive' element={<Archive />} />
            <Route path='voting' element={<Voting />} />
            <Route path='admin' element={<Admin />} />
            <Route path={'presentations'} element={<Presentations />} />
          </>
        )}
        <Route path='*' element={<NoPage />} />
      </Route>
    </Routes>
  )
}

export default App
