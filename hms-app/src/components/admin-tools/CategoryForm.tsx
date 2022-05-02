import { Textarea, Group, Button, createStyles, Card } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import {
  addCategory,
  editCategory,
  getCategoryDetails,
} from '../../actions/CategoryActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon } from '@modulz/radix-icons'

type IProps = {
  contextID: string
  context: string
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
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
}))

export default function CategoryForm(props: IProps) {
  const { classes } = useStyles()
  const { contextID, context } = props
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState({
    contextID: contextID,
    title: '',
    description: '',
  })

  const loadSelectedCategory = () => {
    getCategoryDetails(contextID).then(
      (data) => {
        setIsError(false)
        setIsLoading(false)
        setCategory({
          title: data.title,
          description: data.description,
          contextID: data.id,
        })
      },
      () => {
        setIsError(true)
        setIsLoading(false)
      }
    )
  }

  useEffect(() => {
    loadSelectedCategory()
    setIsLoading(true)
  }, [])

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setCategory((prevCategoryText) => ({
      ...prevCategoryText,
      [event.target.name]: event.target.value,
    }))
  }

  function editThisCategory(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'category-load',
      loading: true,
      title: 'Category is uploading',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })
    editCategory(category).then((r) =>
      setTimeout(() => {
        updateNotification({
          id: 'category-load',
          color: 'teal',
          title: 'Categorie was added',
          message: 'Notification will close in 2 seconds',
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }, 3000)
    )
  }

  function createCategory(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'category-load',
      loading: true,
      title: 'Category is uploading',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })
    addCategory(category).then((r) =>
      setTimeout(() => {
        updateNotification({
          id: 'category-load',
          color: 'teal',
          title: 'Categorie was added',
          message: 'Notification will close in 2 seconds',
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }, 3000)
    )
  }

  function submitIsEnabled(): boolean {
    return !!category.title
  }

  return (
    <>
      {isLoading && (
        <div>
          <h3>Category details are loading...</h3>
        </div>
      )}
      {!isLoading && (
        <Card withBorder radius="md" p="md" className={classes.card}>
          <Card.Section className={classes.section}>
            <Textarea
              label="Title"
              mt="sm"
              required
              placeholder="Title"
              maxRows={1}
              autosize
              onChange={handleChange}
              name="title"
              value={category.title}
            />
          </Card.Section>
          <Card.Section className={classes.section}>
            <Textarea
              label="Description"
              mt="sm"
              placeholder="Description"
              maxRows={1}
              autosize
              onChange={handleChange}
              name="description"
              value={category.description}
            />
          </Card.Section>
          <Group position="right" mt="xl">
            {context === 'edit' && (
              <Button disabled={!submitIsEnabled()} onClick={editThisCategory}>
                Submit category
              </Button>
            )}
            {context === 'new' && (
              <Button disabled={!submitIsEnabled()} onClick={createCategory}>
                Submit category
              </Button>
            )}
          </Group>
        </Card>
      )}
    </>
  )
}
