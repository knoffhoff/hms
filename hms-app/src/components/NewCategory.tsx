import {
  Textarea,
  Group,
  Button,
  createStyles,
  Card,
  SimpleGrid,
  TextInput,
} from '@mantine/core'
import React, { useState } from 'react'
import { addCategory } from '../actions/CategoryActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon } from '@modulz/radix-icons'

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

function NewCategory() {
  const { classes } = useStyles()
  const [categoryText, setCategoryText] = useState({
    title: '',
    description: '',
    hackathonID: '',
    titleSet: false,
    hackathonIDSet: false,
  })

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setCategoryText((prevCategoryText) => ({
      ...prevCategoryText,
      [event.target.name]: event.target.value,
      titleSet: true,
    }))
  }

  function handleChangeH(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setCategoryText((prevCategoryText) => ({
      ...prevCategoryText,
      [event.target.name]: event.target.value,
      hackathonIDSet: true,
    }))
  }

  function submitForm(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'category-load',
      loading: true,
      title: 'Category is uploading',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })
    setCategoryText((prevCategoryText) => ({
      ...prevCategoryText,
      titleSet: false,
      descriptionSet: false,
      hackathonIDSet: false,
    }))
    addCategory(categoryText).then((r) =>
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

  return (
    <>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <Card.Section className={classes.section}>
          <Textarea
            label="Hackathon ID"
            mt="sm"
            required
            placeholder="Hackathon ID"
            maxRows={1}
            autosize
            onChange={handleChangeH}
            name="hackathonID"
          />
        </Card.Section>
        <Card.Section className={classes.section}>
          <Textarea
            label="Title"
            mt="sm"
            required
            disabled={!categoryText.hackathonIDSet}
            placeholder="Title"
            maxRows={1}
            autosize
            onChange={handleChange}
            name="title"
          />
        </Card.Section>
        <Card.Section className={classes.section}>
          <Textarea
            label="Description"
            mt="sm"
            disabled={!categoryText.hackathonIDSet}
            placeholder="Description"
            maxRows={1}
            autosize
            onChange={handleChange}
            name="description"
          />
        </Card.Section>
        <Group position="right" mt="xl">
          <Button disabled={!categoryText.titleSet} onClick={submitForm}>
            Submit category
          </Button>
        </Group>
      </Card>{' '}
    </>
  )
}

export default NewCategory
