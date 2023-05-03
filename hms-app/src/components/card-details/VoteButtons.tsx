import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Stack, Text } from '@mantine/core'
import { Idea, Participant } from '../../common/types'
import { useMsal } from '@azure/msal-react'
import { styles } from '../../common/styles'
import { JOIN_BUTTON_COLOR, LEAVE_BUTTON_COLOR } from '../../common/colors'
import VotingHandler from './VotingHandler'
import {
  createIdeaVoteParticipant,
  removeIdeaVoteParticipant,
} from '../../actions/ParticipantActions'
import { HackathonParticipantContext } from '../../pages/AllIdeas'

type IProps = {
  idea: Idea
}

export default function VoteButtons(props: IProps) {
	const { idea } = props
	const HackathonParticipantId = useContext(HackathonParticipantContext)
  const { instance } = useMsal()
  const { classes } = styles()
  const [buttonIsDisabled, setButtonIsDisabled] = useState(false)

  const [voteCheck, setVoteCheck] = useState(false)

  const removeThisVote = () => {
    removeVote(removeIdeaVoteParticipant, setVoteCheck)
  }

  const addThisVote = async () => {
    await addVote(createIdeaVoteParticipant, setVoteCheck)
  }

  useEffect(() => {
    if (HackathonParticipantId) {
      setButtonIsDisabled(false)
    }
  }, [voteCheck])

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
