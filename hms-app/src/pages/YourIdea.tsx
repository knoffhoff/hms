import React from 'react'
import ideaData from '../test/TestIdeaData'
import IdeaCardSmall from '../components/IdeaCardSmall'

function YourIdea() {
  const ideas = ideaData.map((idea) => {
    return (
      <IdeaCardSmall
        {...idea} //spreads the item in its components in 1 line of code
      />
    )
  })

  return (
    <>
      <h1>this is the your idea page</h1>
      <a href="/Your_Idea/Create_New_Idea">Create new idea</a>
      <h2>Your Ideas:</h2>
      <div className="idea-list">{ideas}</div>
    </>
  )
}

export default YourIdea
