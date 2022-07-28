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

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='ideas' element={<AllIdeas />} />
        <Route path='my-ideas' element={<MyIdeas />} />
        <Route path='archive' element={<Archive />} />
        <Route path='voting' element={<Voting />} />
        <Route path='admin' element={<Admin />} />
        <Route path='*' element={<NoPage />} />
      </Route>
      <Route path={'presentations'} element={<Presentations />} />
    </Routes>
  )
}

export default App
