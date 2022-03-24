import React, { useState } from 'react'
import IdeaCardSmall from '../components/IdeaCardSmall'
import ideaData from '../test/TestIdeaData'

function IdeaPortal() {
  const [searchedString, setSearchString] = useState('')
  const ideas = ideaData.map((idea) => idea)
  const filteredIdeas = ideas.filter((item) => {
    return item.title.includes(searchedString)
  })
  const filteredIdeaList = filteredIdeas.map((idea, index) => {
    const props = { ...idea, index }
    return (
      <div>
        <IdeaCardSmall {...props} />
      </div>
    )
  })

  function handleChange(event: any) {
    setSearchString(event.target.value)
  }

  return (
    <>
      <h1>this is the IdeaPortal</h1>
      <div>
        <h2>Ideas List:</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <p>Search for: </p>
          <input type="text" onChange={handleChange} />
        </div>
      </div>
      <div className="filter">
        <h2>below is the searched idea title</h2>
        {filteredIdeaList}
      </div>
    </>
  )
}

export default IdeaPortal
