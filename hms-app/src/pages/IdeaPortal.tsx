import React, { useState } from 'react'
import IdeaCardSmall from '../components/IdeaCardSmall'
import ideaData from '../test/TestIdeaData'
import { Modal } from '@mantine/core'
import IdeaCardBig from '../components/IdeaCardBig'

function IdeaPortal() {
  const IdeasList = ideaData.map((idea, index) => {
    let props = { ...idea, index }
    return (
      <div>
        <IdeaCardSmall {...props} />
      </div>
    )
  })

  return (
    <>
      <h1>this is the IdeaPortal</h1>
      <div>
        <h2>Ideas List:</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <p>Search for: </p>
          <input />
        </div>
      </div>
      <div className="idea-list">{IdeasList}</div>
    </>
  )
}

export default IdeaPortal
