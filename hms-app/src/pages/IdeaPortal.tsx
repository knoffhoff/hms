import React from 'react'
import IdeaCardSmall from '../components/IdeaCardSmall'
import ideaData from '../test/TestIdeaData'
import CategoryDropdown from '../components/CategoryDropdown'
import { SimpleGrid } from '@mantine/core'

function IdeaPortal() {
  const IdeasList = ideaData.map((idea) => {
    return <IdeaCardSmall {...idea} />
  })

  return (
    <>
      <h1>this is the IdeaPortal</h1>
      <div>
        <h2>Ideas List:</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <p>Search for: </p>
          <input />
          <p>Sort by: </p>
          <input />
          <CategoryDropdown />
        </div>
      </div>
      <h3>chosen categorie is: </h3>
      <div className="idea-list">
        <SimpleGrid
          cols={3}
          spacing={'lg'}
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: 'md' },
            { maxWidth: 755, cols: 2, spacing: 'sm' },
            { maxWidth: 600, cols: 1, spacing: 'sm' },
          ]}
        >
          {IdeasList}
        </SimpleGrid>
      </div>
    </>
  )
}

export default IdeaPortal
