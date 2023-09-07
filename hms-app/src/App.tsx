import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import './App.css'
import Home from './pages/Home'
import AllIdeas from './pages/AllIdeas'
import Archive from './pages/Archive'
import NoPage from './pages/NoPage'
import Voting from './pages/Voting'
import Admin from './pages/Admin'
import Presentations from './pages/Presentations'
import FinalPresentations from './pages/FinalPresentations'
import { useAppSelector } from './hooks'
import { UserSerializable } from './common/redux/userSlice'
import IdeaPool from './pages/IdeaPool'
import SingleIdea from './pages/SingleIdea'

function App() {
  const stateUser = useAppSelector((state) => state.user.user)
  const isAdmin = (user: UserSerializable) => {
    return user && user.roles && user.roles.includes('Admin')
  }

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='idea-pool' element={<IdeaPool />} />
        <Route path='idea-pool/ideas/:idHash' element={<SingleIdea />} />
        <Route path='hackathons' element={<AllIdeas />} />
        <Route path='hackathons/:slug' element={<AllIdeas />} />
        <Route path='hackathons/:slug/ideas/:idHash' element={<SingleIdea />} />
        <Route path='my-ideas' element={<NoPage />} />
        <Route path='archive' element={<Archive />} />
        <Route path='archive/:slug' element={<Archive />} />
        {isAdmin(stateUser) && (
          <>
            <Route path='voting' element={<Voting />} />
            <Route path='admin' element={<Admin />} />
            <Route path={'pitch'} element={<Presentations />} />
            <Route path={'finals'} element={<FinalPresentations />} />
          </>
        )}
        <Route path='*' element={<NoPage />} />
      </Route>
    </Routes>
  )
}

export default App
