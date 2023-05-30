import { useEffect, useState } from 'react'
import { Button, Group, Modal, Text } from '@mantine/core'
import { Idea, IdeaFormType } from '../../common/types'
import { deleteIdea, getIdeaDetails } from '../../actions/IdeaActions'
import IdeaForm from '../input-forms/IdeaForm'
import { styles } from '../../common/styles'
import { showNotification, updateNotification } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { useMsal } from '@azure/msal-react'
import { DELETE_BUTTON_COLOR, JOIN_BUTTON_COLOR } from '../../common/colors'
import FinalVideoUploadModal from '../FinalVideoUploadModal'
import MoveIdeaModal from '../MoveIdeaModal'

type IProps = {
  idea: Idea
  refresh: () => void
}

export default function CardButtons(props: IProps) {
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [editModalOpened, setEditModalOpened] = useState(false)
  const { instance } = useMsal()
  const { classes } = styles()
  const { idea, refresh } = props
  const [ideaData, setIdeaData] = useState(idea)
  const [loader, setLoader] = useState(false)

  const deleteSelectedIdea = () => {
    showNotification({
      id: 'delete-idea-load',
      loading: true,
      title: `Deleting "${ideaData.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    deleteIdea(instance, ideaData.id).then((response) => {
      setDeleteModalOpened(false)
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'delete-idea-load',
          color: 'red',
          title: 'Failed to delete idea',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        updateNotification({
          id: 'delete-idea-load',
          color: 'teal',
          title: `Deleted "${ideaData.title}"`,
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
        refresh()
      }
    })
  }

  const deleteModal = (
    <Modal
      centered
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.text}>
        Are you sure you want to delete this idea?
      </Text>
      <Text className={classes.title}>Title: {ideaData.title}</Text>
      <Button
        style={{ backgroundColor: DELETE_BUTTON_COLOR }}
        onClick={() => deleteSelectedIdea()}
      >
        Yes, delete this idea
      </Button>
      <Text className={classes.text}>
        (This window will automatically close as soon as the idea is deleted)
      </Text>
    </Modal>
  )

  const closeEditModal = (isOpened: boolean) => {
    setEditModalOpened(isOpened)
    loadIdeaData()
  }

  const loadIdeaData = () => {
    getIdeaDetails(instance, ideaData.id).then((data) => {
      setIdeaData(data)
      setLoader(false)
    })
  }

  useEffect(() => {
    loadIdeaData()
  }, [loader])

  const editModal = (
    <Modal
      centered
      opened={editModalOpened}
      onClose={() => setEditModalOpened(false)}
      withCloseButton={false}
      size='55%'
    >
      <Text className={classes.title}>Edit Idea</Text>
      <IdeaForm
        ideaId={ideaData.id}
        idea={ideaData}
        context={IdeaFormType.Edit}
        ownerId={ideaData.owner ? ideaData.owner.id : ''}
        hackathon={ideaData.hackathon!}
        setOpened={closeEditModal}
        onSuccess={refresh}
      />
      <Text className={classes.text}>
        (This window will automatically close as soon as the idea is changed)
      </Text>
    </Modal>
  )

  return (
    <Group position='left' mt='xl'>
      {deleteModal}
      <Button
        style={{
          backgroundColor: DELETE_BUTTON_COLOR,
        }}
        onClick={() => setDeleteModalOpened(true)}
      >
        Delete
      </Button>
      {editModal}
      <Button
        style={{
          backgroundColor: JOIN_BUTTON_COLOR,
        }}
        onClick={() => setEditModalOpened(true)}
      >
        Edit
      </Button>
      <FinalVideoUploadModal idea={ideaData} />
      <MoveIdeaModal idea={ideaData} onSuccess={refresh} />
    </Group>
  )
}
