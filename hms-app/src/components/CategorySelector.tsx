import { MultiSelect } from '@mantine/core'
import { getListOfCategories } from '../actions/CategoryActions'
import { useMsal } from '@azure/msal-react'
import { CategoryPreview } from '../common/types'
import { useEffect, useState } from 'react'

type IProps = {
    hackathonId: string
}

export default function CategorySelector(props: IProps) {

const { hackathonId } = props
  const { instance } = useMsal()
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
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


  
  useEffect(() => {
    loadAvailableCategories()
  }, [])

  useEffect(() => {
    setSelectedHackathonId(hackathonId)
  }, [hackathonId])

  return (
    <MultiSelect
      data={availableCategories.}
      label='Select categories'
      placeholder='Pick all that apply'
    />
  )
}
