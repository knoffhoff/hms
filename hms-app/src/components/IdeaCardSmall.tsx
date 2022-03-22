import React from 'react'
import favIcon from '../images/favIcon.png'

function IdeaCardSmall(idea: any) {
  return (
    <>
      <h3>{idea.titel}</h3>
      <p>{idea.description}</p>
      <div style={{ display: 'flex', gap: '5px' }}>
        <img src={favIcon} style={{ width: '30px', height: '30px' }} />
        <p>number of favs: {idea.favNumber}</p>
      </div>
    </>
  )
}

export default IdeaCardSmall
