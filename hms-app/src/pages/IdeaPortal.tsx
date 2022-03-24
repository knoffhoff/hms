import React, { useState } from 'react'
import IdeaCardSmall from '../components/IdeaCardSmall'
import ideaData from '../test/TestIdeaData'
import { SimpleGrid, Input, Group, Title } from '@mantine/core'

function IdeaPortal() {
  const [searchedString, setSearchString] = useState('')
  const filteredIdeas = ideaData.filter((item) => {
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
      <Title order={1}>All ideas</Title>
      <Group position={'right'} py={20}>
        <Input variant="default" placeholder="Search..." />
        <p>Search for: </p>
          <input type="text" onChange={handleChange} />
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
          <h2>below is the searched idea title</h2>
          {filteredIdeaList}
        </SimpleGrid>
      </div>
    </>
  )
}

export default IdeaPortal
