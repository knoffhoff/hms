import React, { useState } from 'react'
import IdeaCardBig from '../components/IdeaCardBig'
import ideaData from '../test/TestIdeaData'

function IdeaDetails() {
  const [id, setId] = useState({ id: 0 })
  const ideas = ideaData.map((idea) => {
    return (
      <IdeaCardBig
        {...idea} //spreads the item in its components in 1 line of code
      />
    )
  })

  return (
    <>
      <h1>this is the details page</h1>
      <h2>Idea card big:</h2>
      <div className="big-idea-list">{ideas[id.id]}</div>
    </>
  )
}

export default IdeaDetails
