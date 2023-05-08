import { Accordion, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { CategoryPreview } from '../../common/types'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import { getListOfCategories } from '../../actions/CategoryActions'
import CategoryDetails from '../card-details/CategoryDetails'
import CategoryForm from '../input-forms/CategoryForm'

type IProps = {
  hackathonID: string
}

function AllCategoryList(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const [isLoading, setIsLoading] = useState(true)
  const [categoryList, setCategoryList] = useState({
    categories: [] as CategoryPreview[],
  })
  const { hackathonID } = props
  const [openedAccordion, setOpenedAccordion] = useState<string | null>(null)

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
        <CategoryDetails
          categoryId={category.id.toString()}
          onSuccess={refreshList}
        />
      </Accordion.Panel>
    </Accordion.Item>
  ))

  useEffect(() => {
    loadCategories()
  }, [])

  function refreshList() {
    setIsLoading(true)
    loadCategories()
  }

  const closeAccordion = () => {
    setOpenedAccordion(null)
    loadCategories()
  }

  return (
    <>
      <Accordion chevronPosition={'left'}>
        <Accordion.Item value={'categories'}>
          <Accordion.Control>
            <Text className={classes.label}>
              Categories ( {allCategories?.length} )
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Accordion
              chevronPosition={'right'}
              value={openedAccordion}
              onChange={setOpenedAccordion}
            >
              <Accordion.Item
                className={classes.borderAccordion}
                value={'add-category'}
              >
                <Accordion.Control>Add Category</Accordion.Control>
                <Accordion.Panel>
                  <CategoryForm
                    hackathonId={hackathonID}
                    context={'new'}
                    categoryId={''}
                    onSuccess={closeAccordion}
                  />
                </Accordion.Panel>
              </Accordion.Item>
              {!isLoading && allCategories}
              {isLoading && <div>Loading...</div>}
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default AllCategoryList
