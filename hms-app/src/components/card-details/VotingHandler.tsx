import { Button, Card, Stack, Text } from '@mantine/core'
import {
  createIdeaVoteParticipant,
  removeIdeaVoteParticipant,
} from '../../actions/ParticipantActions'
import { useContext, useEffect, useState } from 'react'
import { styles } from '../../common/styles'
import { UserContext } from '../../pages/Layout'
import { HackathonParticipantContext } from '../../pages/AllIdeas'
import { getIdeaDetails } from '../../actions/IdeaActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useMsal } from '@azure/msal-react'
import { Check, X } from 'tabler-icons-react'
import { Idea } from '../../common/types'
import { JOIN_BUTTON_COLOR, LEAVE_BUTTON_COLOR } from '../../common/colors'

type IProps = {
  idea: Idea
}

// Vote Button Only
export function VoteButtons(props: IProps) {
  const { idea } = props
  const user = useContext(UserContext)
  const { classes } = styles()
  const { instance } = useMsal()
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false)
  const [voteCheck, setVoteCheck] = useState(false)
  const [loader, setLoader] = useState(false)
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
        icon: <X />,
        autoClose: 5000,
      })
      console.log(check, participantInfo)
      return
    }
    setButtonIsDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: `Removing vote from: "${idea.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    action(instance, idea.id, participantInfo.participantId).then(
      (response) => {
        setButtonIsDisabled(false)
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
            title: `Vote removed from: "${idea.title}"`,
            message: undefined,
            icon: <Check />,
            autoClose: 2000,
          })
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
        icon: <X />,
        autoClose: 5000,
      })
      return
    }
    setButtonIsDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: `Adding vote to: "${idea.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    action(instance, idea.id, participantInfo.participantId).then(
      (response) => {
        setButtonIsDisabled(false)
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
            title: `Vote added to: "${idea.title}"`,
            message: undefined,
            icon: <Check />,
            autoClose: 2000,
          })
        }
      }
    )

    const findVoter = () => {
      if (idea && idea.voters && user) {
        const voter = idea.voters.find((voter) => voter.user.id === user.id)
        if (voter) {
          return voter
        } else {
          return null
        }
      }
    }

    const findParticipant = () => {
      if (ideaData && idea.participants && user) {
        const participant = idea.participants.find(
          (participant) => participant.user.id === user.id
        )
        if (participant) {
          return participant
        } else {
          return null
        }
      }
    }

    useEffect(() => {
      if (findVoter()) setVoteCheck(!!findVoter())
    }, [idea])

    return (
      <Card.Section className={classes.noBorderSection}>
        <Stack align={'center'} spacing={'xs'}>
          <Button
            disabled={buttonIsDisabled}
            onClick={voteCheck ? removeThisVote : addThisVote}
            style={{
              backgroundColor: voteCheck
                ? LEAVE_BUTTON_COLOR
                : JOIN_BUTTON_COLOR,
            }}
          >
            {voteCheck ? 'Remove Vote' : 'Add Vote'}
          </Button>
        </Stack>
      </Card.Section>
    )
  }

  useEffect(() => {
    loadIdeaData()
  }, [loader])

  const loadIdeaData = () => {
    getIdeaDetails(instance, idea.id).then((data) => {
      setIdeaData(data)
      setLoader(false)
    })
  }

  return (
    <Card.Section className={classes.noBorderSection}>
      <Stack align={'center'} spacing={'xs'}>
        <Button
          disabled={buttonIsDisabled}
          onClick={voteCheck ? removeThisVote : addThisVote}
          style={{
            backgroundColor: voteCheck ? LEAVE_BUTTON_COLOR : JOIN_BUTTON_COLOR,
          }}
        >
          {voteCheck ? 'Remove Vote' : 'Add Vote'}
        </Button>
      </Stack>
    </Card.Section>
  )
}

// Vote Logic
export default function VotingHandler(props: IProps) {
  const hackathonParticipantId = useContext(HackathonParticipantContext)
  const { instance } = useMsal()
  const user = useContext(UserContext)
  const { classes } = styles()
  const { idea } = props
  const [loader, setLoader] = useState(false)
  const [ideaData, setIdeaData] = useState(idea)

  const loadIdeaData = () => {
    getIdeaDetails(instance, idea.id).then((data) => {
      setIdeaData(data)
      setLoader(false)
    })
  }
}
