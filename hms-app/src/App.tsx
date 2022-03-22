import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './pages/Layout'
import './App.css'
import Home from './pages/Home'
import IdeaPortal from './pages/IdeaPortal'
import YourIdea from './pages/YourIdea'
import Archive from './pages/Archive'
import NoPage from './pages/NoPage'
import LogInPage from './pages/LogInPage'
import CreateNewIdea from './pages/CreateNewIdea'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LogInPage />} />
        <Route path="Home" element={<Home />} />
        <Route path="Idea_Portal" element={<IdeaPortal />} />
        <Route path="Your_Idea" element={<YourIdea />} />
        <Route path="Archive" element={<Archive />} />
        <Route path="Idea_Portal/Create_New_Idea" element={<CreateNewIdea />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  )
}

export default App
