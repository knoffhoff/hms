import { MultiSelect } from '@mantine/core'
import { getListOfCategories } from '../actions/CategoryActions'
import { useMsal } from '@azure/msal-react'
import { CategoryPreview } from '../common/types'
import { useEffect, useState } from 'react'
import { Filter } from 'tabler-icons-react'

type IProps = {
  hackathonId: string
  onSelectedCategory: (category: React.SetStateAction<string[]>) => void
}

export default function CategorySelector(props: IProps) {
  const { hackathonId } = props
  const { instance } = useMsal()
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState({
    categories: [] as CategoryPreview[],
  })

  const loadAvailableCategories = () => {
    if (selectedHackathonId !== '') {
      getListOfCategories(instance, selectedHackathonId).then((data) => {
        setAvailableCategories({
          ...availableCategories,
          categories: data.categories,
        })
      })
    }
  }

  const handleCategorySelected = (event: {
    target: { value: React.SetStateAction<string[]> }
  }) => {
    setSelectedCategory(event.target.value)
    props.onSelectedCategory(event.target.value)
  }

  const categories = availableCategories.categories.map((category) => ({
    value: category.id,
    label: category.title,
  }))

  useEffect(() => {
    loadAvailableCategories()
  }, [selectedHackathonId])

  useEffect(() => {
    handleCategorySelected({ target: { value: selectedCategory } })
  }, [selectedCategory])

  useEffect(() => {
    setSelectedHackathonId(hackathonId)
  }, [hackathonId])

  return (
    <MultiSelect
      style={{ maxWidth: 350, maxHeight: 100 }}
      clearable
      searchable
      nothingFound='No categories found'
      data={categories}
      placeholder='Filter by category'
      icon={<Filter />}
      maxDropdownHeight={150}
      value={selectedCategory}
      onChange={(value) => setSelectedCategory(value)}
    />
  )
}
