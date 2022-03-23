import React, { useState } from 'react'
import favIcon from '../images/favIcon.png'
import IdeaCardBig from './IdeaCardBig'
import { Modal } from '@mantine/core'
import ideaData from '../test/TestIdeaData'

function IdeaCardSmall(idea: any) {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <h3>{idea.title}</h3>
      <p>{idea.description}</p>
      <div style={{ display: 'flex', gap: '5px' }}>
        <img src={favIcon} style={{ width: '30px', height: '30px' }} />
        <p>number of favs: {idea.favNumber}</p>
      </div>
      <div className="modal-with-button">
        <Modal
          centered
          withCloseButton={false}
          opened={opened}
          onClose={() => setOpened(false)}
        >
          <IdeaCardBig {...ideaData[idea.id]} />
        </Modal>
        <button onClick={() => setOpened(true)}>see details</button>
      </div>
    </div>
  )
}

export default IdeaCardSmall
