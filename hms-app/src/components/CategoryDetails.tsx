import React, { useEffect, useState } from 'react'
import { Category } from '../common/types'
import { Button, Card, createStyles, Group, Modal, Text } from '@mantine/core'
import { deleteCategory, getCategoryDetails } from '../actions/CategoryActions'

type IProps = {
  categoryID: string
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}))

export default function CategoryDetails(props: IProps) {
  const { classes } = useStyles()
  const { categoryID } = props
  const [opened, setOpened] = useState(false)
  const [categoryData, setCategoryData] = useState({
    errorCategoryData: false,
    isLoadingCategoryData: true,
    id: 'string',
    title: 'string',
    description: 'string',
    hackathonId: 'string',
  } as Category)

  const loadSelectedCategory = () => {
    getCategoryDetails(categoryID).then(
      (data) => {
        setCategoryData({
          id: data.id,
          title: data.title,
          description: data.description,
          hackathonId: data.hackathonId,
          errorCategoryData: false,
          isLoadingCategoryData: false,
        })
      },
      () => {
        setCategoryData({
          ...categoryData,
          errorCategoryData: true,
          isLoadingCategoryData: false,
        })
      }
    )
  }

  const deleteSelectedCategory = () => {
    deleteCategory(categoryData.id).then((data) => {
      setOpened(false)
    })
  }

  useEffect(() => {
    loadSelectedCategory()
    setCategoryData({
      ...categoryData,
      isLoadingCategoryData: true,
    })
  }, [])

  return (
    <>
      {categoryData.errorCategoryData && (
        <div>
          <h3>Error loading hackathons</h3>
          <p>something went wrong.</p>
        </div>
      )}
      {categoryData.isLoadingCategoryData && (
        <div>
          <h3>Category details are loading...</h3>
        </div>
      )}

      {!categoryData.isLoadingCategoryData && (
        <Card withBorder radius="md" p="md" className={classes.card}>
          <Card.Section className={classes.section}>
            <Text size="md" mt="xs">
              {categoryData.title}
            </Text>
            <Text size={'xs'}>ID: {categoryData.id}</Text>
          </Card.Section>
          <Card.Section className={classes.section}>
            <Text mt="md" className={classes.label} color="dimmed">
              Description:
            </Text>
            <Text size="md" mt="xs">
              {categoryData.description}
            </Text>
          </Card.Section>
          <Card.Section className={classes.section}>
            <Modal
              centered
              opened={opened}
              onClose={() => setOpened(false)}
              withCloseButton={false}
            >
              Are you sure you want to delete this category?
              <h4>Title: {categoryData.title}</h4>
              <Button color={'red'} onClick={() => deleteSelectedCategory()}>
                Yes delete this category
              </Button>
              <p>
                (This window will automatically close as soon as the category is
                deleted)
              </p>
            </Modal>
            <Group position="left" mt="xl">
              <Button color={'red'} onClick={() => setOpened(true)}>
                Delete
              </Button>
              <Button>Edit</Button>
              <Button color={'green'} onClick={() => loadSelectedCategory()}>
                Reload
              </Button>
            </Group>
          </Card.Section>
        </Card>
      )}
    </>
  )
}
