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
import CreateNewIdea from './pages/CreateNewIdea'
import Voting from './pages/Voting'
import SingleIdeaPage from './pages/SingleIdeaPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LogInPage />} />
        <Route path="home" element={<Home />} />
        <Route path="ideas" element={<IdeaPortal />} />
        <Route path="ideas/:ideaId" element={<SingleIdeaPage />} />
        <Route path="your-ideas" element={<YourIdeas />} />
        <Route path="your-ideas/create" element={<CreateNewIdea />} />
        <Route path="archive" element={<Archive />} />
        <Route path="voting" element={<Voting />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  )
}

export default App
