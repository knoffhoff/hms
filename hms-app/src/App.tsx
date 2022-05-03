import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import './App.css'
import Home from './pages/Home'
import IdeaPortal from './pages/IdeaPortal'
import YourIdeas from './pages/YourIdeas'
import Archive from './pages/Archive'
import NoPage from './pages/NoPage'
import LogInPage from './pages/LogInPage'
import Voting from './pages/Voting'
import AdminPage from './pages/AdminPage'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LogInPage />} />
        <ProtectedRoute path="profile" element={<Profile />} />
        <ProtectedRoute path="home" element={<Home />} />
        <ProtectedRoute path="ideas" element={<IdeaPortal />} />
        <ProtectedRoute path="your-ideas" element={<YourIdeas />} />
        <ProtectedRoute path="archive" element={<Archive />} />
        <ProtectedRoute path="voting" element={<Voting />} />
        <ProtectedRoute path="admin" element={<AdminPage />} />
        <ProtectedRoute path="*" element={<NoPage />} />
      </Route>
    </Routes>
  )
}

export default App
