import React from 'react'
import ideaData from '../test/TestIdeaData'
import IdeaCardSmall from '../components/IdeaCardSmall'

function YourIdeas() {
  const ideas = ideaData.map((idea, index) => {
    let props = { ...idea, index }
    return (
      <div>
        <IdeaCardSmall {...props} />
      </div>
    )
  })

  return (
    <>
      <h1>this is the your idea page</h1>
      <a href="/your-ideas/create">Create new idea</a>
      <h2>Your Ideas:</h2>
      <div className="idea-list">{ideas}</div>
    </>
  )
}

export default YourIdeas
