import React from 'react'
import ideaData from '../test/TestIdeaData'
import IdeaCardSmall from '../components/IdeaCardSmall'
import IdeaCardList from '../components/IdeaCardList'

function YourIdeas() {
  return (
    <>
      <h1>this is the your idea page</h1>
      <a href="/your-ideas/create">Create new idea</a>
      <h2>Your Ideas:</h2>
      <IdeaCardList ideas={ideaData}></IdeaCardList>
    </>
  )
}

export default YourIdeas
