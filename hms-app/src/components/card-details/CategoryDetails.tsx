import React, { useEffect, useState } from 'react'
import { Category } from '../../common/types'
import { Button, Card, Group, Modal, Text } from '@mantine/core'
import {
  deleteCategory,
  getCategoryDetails,
} from '../../actions/CategoryActions'
import CategoryForm from '../input-forms/CategoryForm'
import { styles } from '../../common/styles'

type IProps = {
  categoryId: string
}

export default function CategoryDetails(props: IProps) {
  const { classes } = styles()
  const { categoryId } = props
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
    getCategoryDetails(categoryId).then(
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
    deleteCategory(categoryData.id).then((data) => {
      setDeleteModalOpened(false)
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
      Are you sure you want to delete this category?
      <h4>Title: {categoryData.title}</h4>
      {!isLoading && (
        <Button color={'red'} onClick={() => deleteSelectedCategory()}>
          Yes delete this category
        </Button>
      )}
      <p>
        (This window will automatically close as soon as the category is
        deleted)
      </p>
    </Modal>
  )

  const editModal = (
    <Modal
      centered
      opened={editModalOpened}
      onClose={() => setEditModalOpened(false)}
      withCloseButton={false}
    >
      Edit Category
      <CategoryForm
        categoryId={categoryData.id}
        context={'edit'}
        hackathonId={''}
      />
      {isLoading && <div>Loading...</div>}
      <p>
        (This window will automatically close as soon as the category is
        deleted)
      </p>
    </Modal>
  )

  return (
    <>
      {isError && !isLoading && (
        <div>
          <h3>Error loading hackathons</h3>
          <p>something went wrong.</p>
        </div>
      )}
      {isLoading && !isError && (
        <div>
          <h3>Category details are loading...</h3>
        </div>
      )}

      {!isLoading && !isError && (
        <Card withBorder radius="md" p="md" className={classes.card}>
          <Card.Section className={classes.borderSection}>
            <Text size="md" mt="xs">
              {categoryData.title}
            </Text>
            <Text size={'xs'}>ID: {categoryData.id}</Text>
          </Card.Section>
          <Card.Section className={classes.borderSection}>
            <Text mt="md" className={classes.label} color="dimmed">
              Description:
            </Text>
            <Text size="md" mt="xs">
              {categoryData.description}
            </Text>
          </Card.Section>
          <Card.Section className={classes.borderSection}>
            <Group position="left" mt="xl">
              {deleteModal}
              <Button color={'red'} onClick={() => setDeleteModalOpened(true)}>
                Delete
              </Button>
              {editModal}
              <Button onClick={() => setEditModalOpened(true)}>Edit</Button>
            </Group>
          </Card.Section>
        </Card>
      )}
    </>
  )
}
