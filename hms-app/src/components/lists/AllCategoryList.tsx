import { Accordion, Button, Card, Group } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { CategoryPreview } from '../../common/types'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import { getListOfCategories } from '../../actions/CategoryActions'
import CategoryDetails from '../card-details/CategoryDetails'

type IProps = {
  hackathonID: string
  refreshCategoryList?: boolean
}

function AllCategoryList(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const [isLoading, setIsLoading] = useState(true)
  const [categoryList, setCategoryList] = useState({
    categories: [] as CategoryPreview[],
  })
  const { hackathonID, refreshCategoryList } = props

  const loadCategories = () => {
    getListOfCategories(instance, hackathonID).then((data) => {
      setIsLoading(false)
      setCategoryList({
        categories: data.categories,
      })
    })
  }

  const allCategories = categoryList.categories?.map((category, index) => (
    <Accordion.Item key={category.id} value={category.id}>
      <Accordion.Control>
        {index + 1}. {category.title}
      </Accordion.Control>
      <Accordion.Panel>
        <CategoryDetails categoryId={category.id.toString()} />
      </Accordion.Panel>
    </Accordion.Item>
  ))

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadCategories()
  }, [refreshCategoryList])

  function refreshList() {
    setIsLoading(true)
    loadCategories()
  }

  return (
    <>
      <Card withBorder className={classes.card}>
        <Card.Section className={classes.borderSection}>
          <Group position='left' mt='xl'>
            {!isLoading && <Button onClick={refreshList}>Refresh list</Button>}
            {isLoading && <div>Loading...</div>}
          </Group>
        </Card.Section>
        <Card.Section>
          <Accordion chevronPosition={'right'}>{allCategories}</Accordion>
        </Card.Section>
      </Card>{' '}
    </>
  )
}

export default AllCategoryList
