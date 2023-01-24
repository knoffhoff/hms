import { useMsal } from '@azure/msal-react'
import {
  createIdeaComment,
  deleteIdeaComment,
  editIdeaComment,
  getIdeaCommentList,
} from '../../actions/IdeaCommentActions'
import React, { useContext, useEffect, useState } from 'react'
import { IdeaCardType, IdeaComment } from '../../common/types'
import {
  Accordion,
  Avatar,
  Button,
  Card,
  Group,
  Modal,
  Text,
  Textarea,
  UnstyledButton,
} from '@mantine/core'
import { styles } from '../../common/styles'
import {
  dark2,
  DELETE_BUTTON_COLOR,
  JOIN_BUTTON_COLOR,
} from '../../common/colors'
import { showNotification, updateNotification } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { UserContext } from '../../pages/Layout'
import FinalVideoUploadModal from '../FinalVideoUploadModal'
import MoveIdeaModal from '../MoveIdeaModal'
import { deleteIdea } from '../../actions/IdeaActions'

type IProps = {
  ideaId: string
}

export default function IdeaCommentDetails(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { ideaId } = props
  const user = useContext(UserContext)
  const [comments, setComments] = useState([] as IdeaComment[])
  const [commentText, setCommentText] = useState('')
  const [editCommentText, setEditCommentText] = useState('')
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [thisCommentId, setThisCommentId] = useState('')
  const [editingComment, setEditingComment] = useState(false)

  const loadComments = () => {
    try {
      getIdeaCommentList(instance, ideaId).then((data) => {
        setComments(data.comments)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getNullComments = comments.filter((comment) => !comment.replyTo)

  const getInitials = (
    firstName: string | undefined,
    lastName: string | undefined
  ) => {
    if (firstName && lastName) {
      return `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`
    } else {
      return ''
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setCommentText(event.target.value)
  }

  function handleEditChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setEditCommentText(event.target.value)
  }

  function submitIsEnabled(): boolean {
    return !!commentText
  }

  const deleteModal = (
    <Modal
      centered
      opened={deleteModalOpened}
      onClose={() => setDeleteModalOpened(false)}
      withCloseButton={false}
    >
      <Text className={classes.text}>
        Are you sure you want to delete this comment?
      </Text>
      <Button
        style={{ backgroundColor: DELETE_BUTTON_COLOR }}
        onClick={() => deleteThisComment()}
      >
        delete
      </Button>
    </Modal>
  )

  function createThisComment(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'comment-create',
      loading: true,
      title: 'Creating comment',
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    createIdeaComment(instance, ideaId, commentText, user?.id || '').then(
      (response) => {
        if (JSON.stringify(response).toString().includes('error')) {
          updateNotification({
            id: 'comment-create',
            color: 'red',
            title: 'Failed to create comment',
            message: undefined,
            icon: <X />,
            autoClose: 2000,
          })
        } else {
          updateNotification({
            id: 'comment-create',
            color: 'teal',
            title: 'Comment created',
            message: undefined,
            icon: <Check />,
            autoClose: 5000,
            disallowClose: false,
          })
          setCommentText('')
          loadComments()
        }
      }
    )
  }

  function deleteThisComment() {
    showNotification({
      id: 'delete-comment-load',
      loading: true,
      title: 'Deleting comment',
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    deleteIdeaComment(instance, thisCommentId).then((response) => {
      setDeleteModalOpened(false)
      if (JSON.stringify(response).toString().includes('error')) {
        updateNotification({
          id: 'delete-comment-load',
          color: 'red',
          title: 'Failed to delete comment',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        updateNotification({
          id: 'delete-comment-load',
          color: 'teal',
          title: 'Deleted comment',
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
          disallowClose: false,
        })
        setThisCommentId('')
        loadComments()
      }
    })
  }

  function editThisComment() {
    showNotification({
      id: 'comment-edit',
      loading: true,
      title: 'Updating comment',
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    editIdeaComment(instance, thisCommentId, editCommentText).then(
      (response) => {
        if (JSON.stringify(response).toString().includes('error')) {
          updateNotification({
            id: 'comment-edit',
            color: 'red',
            title: 'Failed to update comment',
            message: undefined,
            icon: <X />,
            autoClose: 2000,
          })
        } else {
          updateNotification({
            id: 'comment-edit',
            color: 'teal',
            title: 'Comment updated',
            message: undefined,
            icon: <Check />,
            autoClose: 2000,
            disallowClose: false,
          })
          setEditCommentText('')
          loadComments()
          setEditingComment(false)
        }
      }
    )
  }

  function deleteSteps(commentId: string) {
    setThisCommentId(commentId)
    setDeleteModalOpened(true)
  }

  function editSteps(comment: IdeaComment) {
    setThisCommentId(comment.id)
    setEditCommentText(comment.text)
    setEditingComment(true)
  }

  function cancelEdit() {
    setEditingComment(false)
    setEditCommentText('')
  }

  useEffect(() => {
    loadComments()
  }, [])

  return (
    <div>
      <Accordion>
        <Accordion.Item
          className={classes.noBorderAccordion}
          value={'ideaComment-details'}
        >
          <Accordion.Control>
            <Text className={classes.title}>
              {getNullComments.length} Comments:
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            {getNullComments.map((comment) => (
              <div key={comment.id} className={classes.borderSection}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '5px',
                  }}
                >
                  <Avatar color='indigo' radius='md' size='sm'>
                    {getInitials(comment.user.firstName, comment.user.lastName)}
                  </Avatar>
                  <Text className={classes.text}>
                    {comment.user.firstName +
                      ' ' +
                      comment.user.lastName +
                      ': '}
                  </Text>
                </div>

                {editingComment && user?.id === comment.user.id ? (
                  <Textarea
                    maxRows={2}
                    autosize
                    onChange={handleEditChange}
                    name='commentText'
                    value={editCommentText}
                  />
                ) : (
                  <Text className={classes.text}>{comment.text}</Text>
                )}

                <Group position={'left'}>
                  <Text className={classes.smallText}>
                    {new Date(comment.creationDate).toDateString()}
                  </Text>
                  {user?.id === comment.user.id && (
                    <Group>
                      <UnstyledButton
                        className={classes.smallText}
                        onClick={() =>
                          editingComment
                            ? editThisComment()
                            : editSteps(comment)
                        }
                      >
                        {editingComment ? 'save' : 'edit'}
                      </UnstyledButton>
                      {deleteModal}
                      <UnstyledButton
                        className={classes.smallText}
                        onClick={() =>
                          editingComment
                            ? cancelEdit()
                            : deleteSteps(comment.id)
                        }
                      >
                        {editingComment ? 'cancel' : 'delete'}
                      </UnstyledButton>
                    </Group>
                  )}
                </Group>
              </div>
            ))}
            <Card.Section className={classes.borderSection}>
              <div
                style={{
                  marginTop: '10px',
                }}
              >
                <Textarea
                  placeholder='write a comment'
                  maxRows={2}
                  autosize
                  onChange={handleChange}
                  name='commentText'
                  value={commentText}
                />
                <Group position='right' mt='sm'>
                  <Button
                    style={{
                      backgroundColor: submitIsEnabled()
                        ? JOIN_BUTTON_COLOR
                        : dark2,
                    }}
                    disabled={!submitIsEnabled()}
                    onClick={createThisComment}
                  >
                    add comment
                  </Button>
                </Group>
              </div>
            </Card.Section>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
