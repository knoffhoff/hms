import { useEffect, useState } from 'react'
import { Button, Group, Modal, Text } from '@mantine/core'
import { Idea, IdeaCardType, IdeaFormType } from '../../common/types'
import { deleteIdea, getIdeaDetails } from '../../actions/IdeaActions'
import IdeaForm from '../input-forms/IdeaForm'
import { styles } from '../../common/styles'
import { showNotification, updateNotification } from '@mantine/notifications'
import { Check, X, Edit, Trash } from 'tabler-icons-react'
import { useMsal } from '@azure/msal-react'
import { DELETE_BUTTON_COLOR, JOIN_BUTTON_COLOR } from '../../common/colors'
import FinalVideoUploadModal from '../FinalVideoUploadModal'
import MoveIdeaModal from '../MoveIdeaModal'

type IProps = {
  idea: Idea
  onSuccess: () => void
  type: IdeaCardType
  ishackathonStarted?: boolean
}

export default function CardButtons(props: IProps) {
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [editModalOpened, setEditModalOpened] = useState(false)
  const { instance } = useMsal()
  const { classes } = styles()
  const { idea, onSuccess, type, ishackathonStarted } = props
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
        onSuccess()
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
        onSuccess={onSuccess}
      />
      <Text className={classes.text}>
        (This window will automatically close as soon as the idea is changed)
      </Text>
    </Modal>
  )

  const uploadButton = () => {
    return (
      (type === IdeaCardType.Admin || ishackathonStarted) && (
        <FinalVideoUploadModal idea={ideaData} />
      )
    )
  }

  return (
    <Group position='center'>
      {deleteModal}
      <Button
        size='xs'
        color={DELETE_BUTTON_COLOR}
        onClick={() => setDeleteModalOpened(true)}
      >
        Delete
        <Trash size={20} style={{ marginLeft: 3 }} />
      </Button>
      {editModal}
      <Button
        size='xs'
        color={JOIN_BUTTON_COLOR}
        onClick={() => setEditModalOpened(true)}
      >
        Edit
        <Edit size={20} style={{ marginLeft: 3 }} />
      </Button>
      <MoveIdeaModal idea={ideaData} onSuccess={onSuccess} />
      {uploadButton()}
    </Group>
  )
}
