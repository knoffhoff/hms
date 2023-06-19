import React, { useState } from 'react'
import { Input } from '@mantine/core'
import { Search } from 'tabler-icons-react'

type Iprops = {
  onSearchTermChange: (searchTerm: React.SetStateAction<string>) => void
}

function SearchBar(props: Iprops) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChangeSearch = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setSearchTerm(event.target.value)
    props.onSearchTermChange(event.target.value)
  }

  return (
    <Input
      variant='default'
      placeholder='Search for idea title...'
      icon={<Search />}
      onChange={handleChangeSearch}
    />
  )
}

export default SearchBar
