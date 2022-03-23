import React from 'react'
import IdeaCardSmall from '../components/IdeaCardSmall'
import ideaData from '../test/TestIdeaData'
import CategoryDropdown from '../components/CategoryDropdown'
import { SimpleGrid, Input, Group } from '@mantine/core'

function IdeaPortal() {
  const IdeasList = ideaData.map((idea) => {
    return <IdeaCardSmall {...idea} />
  })

  return (
    <>
      <h1>All ideas</h1>
      <Group position={'right'} py={20}>
        <Input variant="default" placeholder="Search..." />
      </Group>
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
