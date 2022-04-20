import React, { useState } from 'react'
import ideaData from '../test/TestIdeaData'
import { Input, Group, Title } from '@mantine/core'
import { Search } from 'tabler-icons-react'
import IdeaCardList from '../components/IdeaCardList'

function IdeaPortal() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredIdeas = ideaData.filter((item) => {
    return item.title.includes(searchTerm)
  })

  return (
    <>
      <Title order={1}>All ideas</Title>
      <Group position={'right'} py={20}>
        <Input
          variant="default"
          placeholder="Search for idea title..."
          icon={<Search />}
          onChange={handleChangeSearch}
        />
      </Group>
      <div className="idea-list">
        <IdeaCardList
          ideaPreviews={filteredIdeas}
          columnSize={6}
          type={'idea-portal'}
        />
      </div>
    </>
  )
}

export default IdeaPortal
