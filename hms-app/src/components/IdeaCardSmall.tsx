import React, { useState } from 'react'
import favIcon from '../images/favIcon.png'
import ideaData from '../test/TestIdeaData'
import { Modal } from '@mantine/core'
import IdeaCardBig from './IdeaCardBig'

function IdeaCardSmall(props: any) {
  const [opened, setOpened] = useState(false)
  const [ideaDetailsClicked, setIdeaDetailsClicked] = useState(ideaData[0])

  //TODO functions should only be callable if theres an existing prev/next idea
  function decreaseIdeaIndex() {
    if (ideaDetailsClicked.id > 0)
      setIdeaDetailsClicked(ideaData[ideaDetailsClicked.id - 1])
  }
  function increaseIdeaIndex() {
    if (ideaDetailsClicked.id < ideaData.length - 1)
      setIdeaDetailsClicked(ideaData[ideaDetailsClicked.id + 1])
  }

  return (
    <div style={{ border: '2px solid #00FFD0' }}>
      <h3>{props.title}</h3>
      <p>{props.description}</p>
      <div style={{ display: 'flex', gap: '5px' }}>
        <img src={favIcon} style={{ width: '30px', height: '30px' }} />
        <p>number of favs: {props.favNumber}</p>
      </div>
      <div className="modal">
        <Modal
          centered
          withCloseButton={false}
          opened={opened}
          onClose={() => setOpened(false)}
        >
          <button onClick={decreaseIdeaIndex}>prev idea</button>
          <IdeaCardBig {...ideaDetailsClicked} />
          <button onClick={increaseIdeaIndex}>next idea</button>
        </Modal>
        <button
          onClick={() => {
            setOpened(true)
            setIdeaDetailsClicked(ideaData[props.index])
          }}
        >
          see details(in the ideaportal page)
        </button>
      </div>
    </div>
  )
}

export default IdeaCardSmall
