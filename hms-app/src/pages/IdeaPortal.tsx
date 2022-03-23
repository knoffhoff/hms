import React, { useState } from 'react'
import IdeaCardSmall from '../components/IdeaCardSmall'
import ideaData from '../test/TestIdeaData'
import { Modal } from '@mantine/core'
import IdeaCardBig from '../components/IdeaCardBig'

function IdeaPortal() {
  const [opened, setOpened] = useState(false)
  const [ideaDetailsClicked, setIdeaDetailsClicked] = useState(ideaData[0])

  //TODO functions should only be callable if theres an existing prev/next idea
  function decreaseIdeaIndex() {
    const index = ideaDetailsClicked.id
    setIdeaDetailsClicked(ideaData[index - 1])
  }
  function increaseIdeaIndex() {
    const index = ideaDetailsClicked.id
    setIdeaDetailsClicked(ideaData[index + 1])
  }

  const IdeasList = ideaData.map((idea, index) => {
    return (
      <div key={idea.id}>
        <IdeaCardSmall
          {...idea} //spreads the item in its components in 1 line of code
        />
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
              setIdeaDetailsClicked(ideaData[index])
            }}
          >
            see details(in the ideaportal page)
          </button>
        </div>
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
