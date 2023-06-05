import { useMsal } from '@azure/msal-react'
import {
  createIdeaComment,
  deleteIdeaComment,
  editIdeaComment,
  getIdeaCommentList,
} from '../../actions/IdeaCommentActions'
import React, { useContext, useEffect, useState } from 'react'
import { IdeaComment } from '../../common/types'
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

type IProps = {
  ideaId: string
}

export default function IdeaCommentDetails(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const { ideaId } = props
  const user = useContext(UserContext)
  const [ideaComments, setIdeaComments] = useState([] as IdeaComment[])
  const [ideaCommentText, setIdeaCommentText] = useState('')
  const [editIdeaCommentText, setEditIdeaCommentText] = useState('')
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [thisIdeaCommentId, setThisIdeaCommentId] = useState('')
  const [editingIdeaComment, setEditingIdeaComment] = useState(false)

  const loadIdeaComments = () => {
    try {
      getIdeaCommentList(instance, ideaId).then((data) => {
        setIdeaComments(data.ideaComments)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getNullIdeaComments = ideaComments.filter(
    (ideaComment) => !ideaComment.parentIdeaCommentId
  )

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
    setIdeaCommentText(event.target.value)
  }

  function handleEditChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setEditIdeaCommentText(event.target.value)
  }

  function submitIsEnabled(): boolean {
    return !!ideaCommentText
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
        onClick={() => deleteThisIdeaComment()}
      >
        delete
      </Button>
    </Modal>
  )

  function createThisIdeaComment(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    showNotification({
      id: 'comment-create',
      loading: true,
      title: 'Creating comment',
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    createIdeaComment(instance, user?.id || '', ideaId, ideaCommentText).then(
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
          setIdeaCommentText('')
          loadIdeaComments()
        }
      }
    )
  }

  function deleteThisIdeaComment() {
    showNotification({
      id: 'delete-comment-load',
      loading: true,
      title: 'Deleting comment',
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    deleteIdeaComment(instance, thisIdeaCommentId).then((response) => {
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
        setThisIdeaCommentId('')
        loadIdeaComments()
      }
    })
  }

  function editThisIdeaComment() {
    showNotification({
      id: 'comment-edit',
      loading: true,
      title: 'Updating comment',
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    editIdeaComment(instance, thisIdeaCommentId, editIdeaCommentText).then(
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
          setEditIdeaCommentText('')
          loadIdeaComments()
          setEditingIdeaComment(false)
        }
      }
    )
  }

  function deleteSteps(ideaCommentId: string) {
    setThisIdeaCommentId(ideaCommentId)
    setDeleteModalOpened(true)
  }

  function editSteps(ideaComment: IdeaComment) {
    setThisIdeaCommentId(ideaComment.id)
    setEditIdeaCommentText(ideaComment.text)
    setEditingIdeaComment(true)
  }

  function cancelEdit() {
    setEditingIdeaComment(false)
    setEditIdeaCommentText('')
  }

  useEffect(() => {
    loadIdeaComments()
  }, [])

  return (
    <div>
      <Accordion>
        <Accordion.Item
          className={classes.noBorderAccordion}
          value={'ideaComment-details'}
        >
          <Accordion.Control>
            <Text style={{ fontWeight: 'bold' }}>
              {getNullIdeaComments.length} Comments:
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            {getNullIdeaComments.map((ideaComment) => (
              <div key={ideaComment.id} className={classes.borderSection}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '5px',
                  }}
                >
                  <Avatar color='indigo' radius='md' size='sm'>
                    {getInitials(
                      ideaComment.user.firstName,
                      ideaComment.user.lastName
                    )}
                  </Avatar>
                  <Text className={classes.text}>
                    {ideaComment.user.firstName +
                      ' ' +
                      ideaComment.user.lastName +
                      ': '}
                  </Text>
                </div>

                {editingIdeaComment &&
                user?.id === ideaComment.user.id &&
                ideaComment.id === thisIdeaCommentId ? (
                  <Textarea
                    maxRows={2}
                    autosize
                    onChange={handleEditChange}
                    name='commentText'
                    value={editIdeaCommentText}
                  />
                ) : (
                  <Text className={classes.text}>{ideaComment.text}</Text>
                )}

                <Group position={'left'}>
                  <Text className={classes.smallText}>
                    {new Date(ideaComment.creationDate).toDateString()}
                  </Text>
                  {user?.id === ideaComment.user.id && (
                    <Group>
                      <UnstyledButton
                        className={classes.smallText}
                        onClick={() =>
                          editingIdeaComment
                            ? editThisIdeaComment()
                            : editSteps(ideaComment)
                        }
                      >
                        {editingIdeaComment ? 'save' : 'edit'}
                      </UnstyledButton>
                      {deleteModal}
                      <UnstyledButton
                        className={classes.smallText}
                        onClick={() =>
                          editingIdeaComment
                            ? cancelEdit()
                            : deleteSteps(ideaComment.id)
                        }
                      >
                        {editingIdeaComment ? 'cancel' : 'delete'}
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
                  placeholder='Write a comment'
                  maxRows={2}
                  autosize
                  onChange={handleChange}
                  name='commentText'
                  value={ideaCommentText}
                />
                <Group position='right' mt='sm'>
                  <Button
                    style={{
                      backgroundColor: submitIsEnabled()
                        ? JOIN_BUTTON_COLOR
                        : dark2,
                    }}
                    disabled={!submitIsEnabled()}
                    onClick={createThisIdeaComment}
                  >
                    Add Comment
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
