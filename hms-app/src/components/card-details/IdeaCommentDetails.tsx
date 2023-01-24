import { useMsal } from '@azure/msal-react'
import {
  createIdeaComment,
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
  Text,
  Textarea,
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
  const [accordionOpen, setAccordionOpen] = useState(false)

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

  function submitIsEnabled(): boolean {
    return !!commentText
  }

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

                <Text className={classes.text}>{comment.text}</Text>
                <Text className={classes.smallText}>
                  {new Date(comment.creationDate).toDateString()}
                </Text>
              </div>
            ))}
            <Card.Section className={classes.borderSection}>
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
            </Card.Section>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}
