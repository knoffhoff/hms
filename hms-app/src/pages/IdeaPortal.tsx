import React, { useState } from 'react'
import IdeaCardSmall from '../components/IdeaCardSmall'
import ideaData from '../test/TestIdeaData'
import CategoryDropdown from '../components/CategoryDropdown'
import { Modal } from '@mantine/core'
import IdeaCardBig from '../components/IdeaCardBig'

function IdeaPortal() {
  const [opened, setOpened] = useState(false)
  const IdeasList = ideaData.map((idea) => {
    return (
      <div key={idea.id}>
        <IdeaCardSmall
          {...idea} //spreads the item in its components in 1 line of code
        />
        <div className="modal-with-button">
          <Modal
            centered
            withCloseButton={false}
            opened={opened}
            onClose={() => setOpened(false)}
          >
            <IdeaCardBig {...idea} />
          </Modal>
          <button onClick={() => setOpened(true)}>
            see details(in the ideaportal page)
          </button>
        </div>
      </div>
    )
  })
  const NewIdeaList = (
    <div>
      <div>
        {ideaData.map((idea) => {
          return (
            <div key={idea.id}>
              <IdeaCardSmall
                {...idea} //spreads the item in its components in 1 line of code
              />
            </div>
          )
        })}
      </div>
      <div className="modal-with-button">
        <Modal
          centered
          withCloseButton={false}
          opened={opened}
          onClose={() => setOpened(false)}
        >
          <IdeaCardBig {...ideaData} />
        </Modal>
        <button onClick={() => setOpened(true)}>
          see details(in the ideaportal page)
        </button>
      </div>
    </div>
  )

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
      {/*<div className="idea-list">{IdeasList}</div>*/}
      <div className="idea-list">{NewIdeaList}</div>
    </>
  )
}

export default IdeaPortal
