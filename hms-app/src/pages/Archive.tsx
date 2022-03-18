import React from 'react'
import ideaData from '../TestIdeaData'
import IdeaCardSmall from '../components/IdeaCardSmall'

function Archive() {
  const ideas = ideaData.map((idea) => {
    return (
      <IdeaCardSmall
        {...idea} //spreads the item in its components in 1 line of code
      />
    )
  })

  return (
    <>
      <h1>this is the Archive</h1>
      <h2>Ideas List:</h2>
      <div className="idea-list">{ideas}</div>
    </>
  )
}

export default Archive
