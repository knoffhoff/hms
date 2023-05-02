import { Button, Card, Stack, Text } from '@mantine/core'
import {
  createIdeaVoteParticipant,
  removeIdeaVoteParticipant,
} from '../../actions/ParticipantActions'
import { JOIN_BUTTON_COLOR, LEAVE_BUTTON_COLOR } from '../../common/colors'
import { useContext, useEffect, useState } from 'react'
import { styles } from '../../common/styles'
import { UserContext } from '../../pages/Layout'
import { HackathonParticipantContext, HackathonVotingContext } from '../../pages/AllIdeas'
import { getIdeaDetails } from '../../actions/IdeaActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useMsal } from '@azure/msal-react'
import { Check, X } from 'tabler-icons-react'
import { Idea } from '../../common/types'

type IProps = {
  idea: Idea
}

export default function VotingHandler(props: IProps) {
  const hackathonParticipantId = useContext(HackathonParticipantContext)
  const { instance } = useMsal()
  const user = useContext(UserContext)
  const { idea } = props
  const { classes } = styles()
  const [ideaData, setIdeaData] = useState(idea)
  const [loader, setLoader] = useState(false)
  const [voteCheck, setVoteCheck] = useState(false)
  const [buttonIsDisabled, setButtonisDisabled] = useState(false)
  const [participantInfo, setParticipantInfo] = useState({
    userId: '',
    participantId: '',
  })

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
        icon: <X />,
        autoClose: 5000,
      })
      console.log(check, participantInfo)
      return
    }
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: `Removing vote from: "${ideaData.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    action(instance, ideaData.id, participantInfo.participantId).then(
      (response) => {
        setButtonisDisabled(false)
        setLoader(true)
        if (JSON.stringify(response).toString().includes('error')) {
          check(false)
          updateNotification({
            id: 'participant-load',
            color: 'red',
            title: 'Failed to remove vote',
            message: undefined,
            icon: <X />,
            autoClose: 2000,
          })
        } else {
          check(true)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: `Vote removed from: "${ideaData.title}"`,
            message: undefined,
            icon: <Check />,
            autoClose: 2000,
          })
        }
      }
    )
  }

  const removeThisVote = () => {
    removeVote(removeIdeaVoteParticipant, setVoteCheck)
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
        icon: <X />,
        autoClose: 5000,
      })
      return
    }
    setButtonisDisabled(true)
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
        setButtonisDisabled(false)
        setLoader(true)
        if (JSON.stringify(response).toString().includes('error')) {
          check(false)
          updateNotification({
            id: 'participant-load',
            color: 'red',
            title: 'Failed to add vote',
            message: undefined,
            icon: <X />,
            autoClose: 2000,
          })
        } else {
          check(true)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: `Vote added to: "${ideaData.title}"`,
            message: undefined,
            icon: <Check />,
            autoClose: 2000,
          })
        }
      }
    )

    useEffect(() => {
      if (findVoter()) setVoteCheck(!!findVoter())
    }, [ideaData])

    const loadIdeaData = () => {
      getIdeaDetails(instance, ideaData.id).then((data) => {
        setIdeaData(data)
        setLoader(false)
      })
    }

    useEffect(() => {
      loadIdeaData()
    }, [loader])
  }

  const addThisVote = async () => {
    await addVote(createIdeaVoteParticipant, setVoteCheck)
  }


  useEffect(() => {
    if (user) {
      setParticipantInfo({
        userId: user.id,
        participantId: hackathonParticipantId,
      })
    }
  }, [user, hackathonParticipantId])

  return (
    <Card.Section className={classes.noBorderSection}>
      <Stack align={'center'} spacing={'xs'}>
        <Text className={classes.label}>Votes: </Text>
        <Text className={classes.text}>{ideaData.voters?.length}</Text>
      </Stack>

      <Button
        disabled={buttonIsDisabled}
        onClick={voteCheck ? removeThisVote : addThisVote}
        style={{
          backgroundColor: voteCheck ? LEAVE_BUTTON_COLOR : JOIN_BUTTON_COLOR,
        }}
      >
        {voteCheck ? 'Remove Vote' : 'Add Vote'}
      </Button>
    </Card.Section>
  )
}
