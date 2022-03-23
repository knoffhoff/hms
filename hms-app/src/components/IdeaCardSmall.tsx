import React from 'react'
import favIcon from '../images/favIcon.png'

function IdeaCardSmall(idea: any) {
  return (
    <div>
      <h3>{idea.title}</h3>
      <p>{idea.description}</p>
      <div style={{ display: 'flex', gap: '5px' }}>
        <img src={favIcon} style={{ width: '30px', height: '30px' }} />
        <p>number of favs: {idea.favNumber}</p>
      </div>
    </div>
  )
}

export default IdeaCardSmall
