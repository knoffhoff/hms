import React from 'react'
import ideaData from '../test/TestIdeaData'
import IdeaCardList from '../components/IdeaCardList'
import { Idea } from '../common/types'

export default function YourIdeas() {
  return (
    <>
      <h1>this is the your idea page</h1>
      <a href="/your-ideas/create">Create new idea</a>
      <h2>Your Ideas:</h2>
      <IdeaCardList ideas={ideaData as Idea[]}></IdeaCardList>
    </>
  )
}
