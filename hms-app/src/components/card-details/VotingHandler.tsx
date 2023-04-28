import {
  Button,
  Card,
  Stack,
  Text,
} from '@mantine/core'
import {
  createIdeaVoteParticipant,
  removeIdeaVoteParticipant,
} from '../../actions/ParticipantActions'
import {
  JOIN_BUTTON_COLOR,
  LEAVE_BUTTON_COLOR,
} from '../../common/colors'
import { useEffect, useState } from 'react'
import { styles } from '../../common/styles'
import { IProps } from './IdeaDetails'


export default function VotingHandler(props: IProps) {
  const { idea } = props
  const { classes } = styles()
  const [ideaData, setIdeaData] = useState(idea)
  const [voteCheck, setVoteCheck] = useState(false)
  const [buttonIsDisabled, setButtonisDisabled] = useState(false)

  const ideaVoting = () => {
    return (
      <Card.Section className={classes.noBorderSection}>
        <Stack align={'center'} spacing={'xs'}>
          <Text className={classes.label}>Votes: </Text>
          <Text className={classes.text}>
              {ideaData.voters?.length}
          </Text>
        </Stack>
      </Card.Section>
    )
  }

  const ideaVoteButton = () => {
    return (
      <Button
        disabled={buttonIsDisabled}
        onClick={
          voteCheck ? removeThisVote : addVoterToIdea
        }
        style={{
          backgroundColor: voteCheck
          ? LEAVE_BUTTON_COLOR
          : JOIN_BUTTON_COLOR,
        }}
      >
      </Button>
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

  const removeThisVote = () => {
    removeParticipant(removeIdeaVoteParticipant, setVoteCheck)
  }

  const addVoterToIdea = async () => {
    await addParticipant(createIdeaVoteParticipant, setVoteCheck)
  }

  useEffect(() => {
    if (findParticipant()) setParticipantCheck(!!findParticipant())
    if (findVoter()) setVoteCheck(!!findVoter())
  }, [ideaData])

  return (
    //
  )
}