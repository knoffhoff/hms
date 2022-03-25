import React from 'react'
import { useState } from 'react'
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchString(event.target.value)

  return (
    <>
      <Title order={1}>All ideas</Title>
      <Group position={'right'} py={20}>
        <Input
          variant="default"
          placeholder="Search..."
          onChange={handleSearchChange}
        />
      </Group>
      <h2>below is the searched idea title</h2>
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
          {filteredIdeaList}
        </SimpleGrid>
      </div>
    </>
  )
}

export default IdeaPortal
