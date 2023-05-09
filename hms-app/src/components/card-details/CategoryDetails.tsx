import React, { useEffect, useState } from 'react'
import { Category } from '../../common/types'
import { Button, Card, Group, Modal, Text } from '@mantine/core'
import {
  deleteCategory,
  getCategoryDetails,
} from '../../actions/CategoryActions'
import CategoryForm from '../input-forms/CategoryForm'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import { DELETE_BUTTON_COLOR, JOIN_BUTTON_COLOR } from '../../common/colors'

type IProps = {
  categoryId: string
  onSuccess: () => void
}

export default function CategoryDetails(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { categoryId, onSuccess } = props
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [editModalOpened, setEditModalOpened] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [categoryData, setCategoryData] = useState({
    id: 'string',
    title: 'string',
    description: 'string',
    hackathonId: 'string',
  } as Category)

  const loadSelectedCategory = () => {
    getCategoryDetails(instance, categoryId).then(
      (data) => {
        setIsError(false)
        setIsLoading(false)
        setCategoryData({
          id: data.id,
          title: data.title,
          description: data.description,
          hackathonId: data.hackathonId,
        })
      },
      () => {
        setIsError(true)
        setIsLoading(false)
      }
    )
  }

  const deleteSelectedCategory = () => {
    deleteCategory(instance, categoryData.id).then(() => {
      setDeleteModalOpened(false)
      onSuccess()
    })
  }

  useEffect(() => {
    loadSelectedCategory()
    setIsLoading(true)
  }, [])

  const deleteModal = (
    <Modal
      centered
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.text}>
        Are you sure you want to delete this category?
      </Text>
      <Text className={classes.title}>Title: {categoryData.title}</Text>
      {!isLoading && (
        <Button
          style={{ backgroundColor: DELETE_BUTTON_COLOR }}
          onClick={() => deleteSelectedCategory()}
        >
          Yes delete this category
        </Button>
      )}
      <Text className={classes.text}>
        (This window will automatically close as soon as the category is
        deleted)
      </Text>
    </Modal>
  )

  const refreshAfterChange = () => {
    setEditModalOpened(false)
    setIsLoading(true)
    loadSelectedCategory()
    onSuccess()
  }

  const editModal = (
    <Modal
      centered
      opened={editModalOpened}
      onClose={() => setEditModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.title}>Edit Category</Text>
      <CategoryForm
        categoryId={categoryData.id}
        context={'edit'}
        hackathonId={''}
        onSuccess={refreshAfterChange}
      />
      {isLoading && <div>Loading...</div>}
      <Text className={classes.text}>
        (This window will automatically close as soon as the category is
        deleted)
      </Text>
    </Modal>
  )

  return (
    <>
      {isError && !isLoading && (
        <div>
          <Text className={classes.title}>Error loading Category</Text>
          <Text className={classes.text}>something went wrong.</Text>
        </div>
      )}
      {isLoading && !isError && (
        <div>
          <Text className={classes.text}>Category details are loading...</Text>
        </div>
      )}

      {!isLoading && !isError && (
        <Card withBorder className={classes.card}>
          <Card.Section className={classes.borderSection}>
            <Text className={classes.title}>{categoryData.title}</Text>
            <Text className={classes.text}>ID: {categoryData.id}</Text>
          </Card.Section>
          <Card.Section className={classes.borderSection}>
            <Text className={classes.label}>Description:</Text>
            <Text className={classes.text}>{categoryData.description}</Text>
          </Card.Section>
          <Card.Section className={classes.borderSection}>
            <Group position='left' mt='xl'>
              {deleteModal}
              <Button
                style={{ backgroundColor: DELETE_BUTTON_COLOR }}
                onClick={() => setDeleteModalOpened(true)}
              >
                Delete
              </Button>
              {editModal}
              <Button
                style={{ backgroundColor: JOIN_BUTTON_COLOR }}
                onClick={() => setEditModalOpened(true)}
              >
                Edit
              </Button>
            </Group>
          </Card.Section>
        </Card>
      )}
    </>
  )
}
