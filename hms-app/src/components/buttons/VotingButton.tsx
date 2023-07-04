import {
  createIdeaVoteParticipant,
  removeIdeaVoteParticipant,
} from '../../actions/ParticipantActions'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../pages/Layout'
import { HackathonParticipantContext } from '../../pages/AllIdeas'
import { getIdeaDetails } from '../../actions/IdeaActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useMsal } from '@azure/msal-react'
import { Idea } from '../../common/types'
import { ActionIcon } from '@mantine/core'
import { CustomCheckIcon, CustomXIcon } from '../NotificationIcons'
import { IconHeart, IconHeartFilled } from '@tabler/icons-react'

type IProps = {
  idea: Idea
  onSuccess: () => void
}

// Vote Button Only
export function VoteButtons(props: IProps) {
  const user = useContext(UserContext)
  const hackathonParticipantId = useContext(HackathonParticipantContext)
  const { idea, onSuccess } = props
  const { instance } = useMsal()
  const [voteCheck, setVoteCheck] = useState(false)
  const [loader, setLoader] = useState(false)
  const [ideaData, setIdeaData] = useState(idea)
  const [participantInfo, setParticipantInfo] = useState({
    userId: '',
    participantId: '',
  })

  const removeThisVote = () => {
    removeVote(removeIdeaVoteParticipant, setVoteCheck)
  }

  const removeVote = async (
    action = removeIdeaVoteParticipant,
    check = setVoteCheck
  ) => {
    if (participantInfo.participantId === '') {
      showNotification({
        id: 'participant-load',
        color: 'red',
        title: 'Not participating in hackathon',
        message: 'You must join the hackathon first to vote.',
        icon: <CustomXIcon />,
        autoClose: 5000,
      })
      return
    }
    showNotification({
      id: 'participant-load',
      loading: true,
      title: `Removing vote from: "${idea.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    action(instance, ideaData.id, participantInfo.participantId).then(
      (response) => {
        setLoader(true)
        if (JSON.stringify(response).toString().includes('error')) {
          check(false)
          updateNotification({
            id: 'participant-load',
            color: 'red',
            title: 'Failed to remove vote',
            message: undefined,
            icon: <CustomXIcon />,
            autoClose: 5000,
          })
        } else {
          check(false)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: `Vote removed from: "${ideaData.title}"`,
            message: undefined,
            icon: <CustomCheckIcon />,
            autoClose: 5000,
          })
          setLoader(true)
          if (onSuccess) {
            onSuccess()
          }
        }
      }
    )
  }

  const addThisVote = async () => {
    await addVote(createIdeaVoteParticipant, setVoteCheck)
  }

  const addVote = async (
    action = createIdeaVoteParticipant,
    check = setVoteCheck
  ) => {
    if (participantInfo.participantId === '') {
      showNotification({
        id: 'participant-load',
        color: 'red',
        title: 'Not participating in hackathon',
        message: 'You must join the hackathon first to vote.',
        icon: <CustomXIcon />,
        autoClose: 5000,
      })
      return
    }
    showNotification({
      id: 'participant-load',
      loading: true,
      title: `Adding vote to: "${ideaData.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    action(instance, ideaData.id, participantInfo.participantId).then(
      (response) => {
        setLoader(true)
        if (JSON.stringify(response).toString().includes('error')) {
          check(false)
          updateNotification({
            id: 'participant-load',
            color: 'red',
            title: 'Failed to add vote',
            message: undefined,
            icon: <CustomXIcon />,
            autoClose: 5000,
          })
        } else {
          check(true)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: `Vote added to: "${ideaData.title}"`,
            message: undefined,
            icon: <CustomCheckIcon />,
            autoClose: 5000,
          })
          if (onSuccess) {
            onSuccess()
          }
        }
      }
    )
  }

  const findVoter = () => {
    if (ideaData && ideaData.voters && user) {
      const voter = ideaData.voters.find((voter) => voter.user.id === user.id)
      if (voter) {
        return voter
      } else {
        return null
      }
    }
  }

  useEffect(() => {
    if (findVoter()) setVoteCheck(!!findVoter())
  }, [ideaData])

  useEffect(() => {
    loadIdeaData()
  }, [loader])

  useEffect(() => {
    if (user) {
      setParticipantInfo({
        userId: user.id,
        participantId: hackathonParticipantId,
      })
    }
  }, [user, hackathonParticipantId])

  const loadIdeaData = () => {
    getIdeaDetails(instance, idea.id).then((data) => {
      setIdeaData(data)
      setLoader(false)
    })
  }

  return (
    <ActionIcon
      variant='transparent'
      onClick={voteCheck ? removeThisVote : addThisVote}
      color='orange.7'
    >
      {voteCheck ? <IconHeartFilled size={50} /> : <IconHeart size={50} />}
    </ActionIcon>
  )
}
