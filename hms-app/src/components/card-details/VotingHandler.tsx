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
import VoteList from './VoteList'
import IdeaDetails from './IdeaDetails'

type IProps = {
  idea: Idea
  reloadIdeaData?: () => void
}

// Vote Button Only
export function VoteButtons(props: IProps) {
  const user = useContext(UserContext)
  const hackathonParticipantId = useContext(HackathonParticipantContext)
  const { idea, reloadIdeaData } = props
  const { classes } = styles()
  const { instance } = useMsal()
  const [voteCheck, setVoteCheck] = useState(false)
  const [buttonIsDisabled, setButtonIsDisabled] = useState(voteCheck)
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
        icon: <X />,
        autoClose: 5000,
      })
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
    action(instance, ideaData.id, participantInfo.participantId).then(
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
          check(false)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: `Vote removed from: "${ideaData.title}"`,
            message: undefined,
            icon: <Check />,
            autoClose: 2000,
          })
          setLoader(true)
          console.log('Vote removed. Count: ' + ideaData.voters?.length)
          if (reloadIdeaData) reloadIdeaData()
          console.log('ReloadIdeaList is: ' + reloadIdeaData)
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
      title: `Adding vote to: "${ideaData.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    action(instance, ideaData.id, participantInfo.participantId).then(
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
            title: `Vote added to: "${ideaData.title}"`,
            message: undefined,
            icon: <Check />,
            autoClose: 2000,
          })
          console.log('Vote added. Count: ' + ideaData.voters?.length)
          if (reloadIdeaData) reloadIdeaData()
          console.log('ReloadIdeaList is: ' + reloadIdeaData)
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

// export function VoteList(props: IProps) {
//   const { instance } = useMsal()
//   const { idea } = props
//   const { classes } = styles()
//   const [ideaData, setIdeaData] = useState(idea)
//   const [loader, setLoader] = useState(false)

//   const loadIdeaData = () => {
//     getIdeaDetails(instance, ideaData.id).then((data) => {
//       setIdeaData(data)
//       setLoader(false)
//     })
//   }

//   function refreshList() {
//     setLoader(true)
//     loadIdeaData()
//   }

//   useEffect(() => {
//     loadIdeaData()
//   }, [loader])

//   return (
//     <Card.Section className={classes.noBorderSection}>
//       <Stack align={'center'} spacing={'xs'}>
//         <Text className={classes.label}>Votes: </Text>
//         <Text className={classes.text}>{idea.voters?.length}</Text>
//       </Stack>
//     </Card.Section>
//   )
// }
