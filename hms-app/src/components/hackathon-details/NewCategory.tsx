import { Textarea, Group, Button, createStyles, Card } from '@mantine/core'
import React, { useState } from 'react'
import { addCategory } from '../../actions/CategoryActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon } from '@modulz/radix-icons'

type IProps = {
  hackathonID: string
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

function NewCategory(props: IProps) {
  const { classes } = useStyles()
  const { hackathonID } = props
  const [hasTitle, setHasTitle] = useState(false)
  const [categoryText, setCategoryText] = useState({
    title: '',
    description: '',
    hackathonID: hackathonID.toString(),
  })

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setCategoryText((prevCategoryText) => ({
      ...prevCategoryText,
      [event.target.name]: event.target.value,
    }))
    setHasTitle(true)
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
    setHasTitle(false)
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
            label="Title"
            mt="sm"
            required
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
            placeholder="Description"
            maxRows={1}
            autosize
            onChange={handleChange}
            name="description"
          />
        </Card.Section>
        <Group position="right" mt="xl">
          <Button disabled={!hasTitle} onClick={submitForm}>
            Submit category
          </Button>
        </Group>
      </Card>{' '}
    </>
  )
}

export default NewCategory
