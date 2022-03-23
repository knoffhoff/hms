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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LogInPage />} />
        <Route path="home" element={<Home />} />
        <Route path="idea-portal" element={<IdeaPortal />} />
        <Route path="your-ideas" element={<YourIdeas />} />
        <Route path="archive" element={<Archive />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  )
}

export default App
