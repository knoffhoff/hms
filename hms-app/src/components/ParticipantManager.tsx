import React, { useEffect, useState } from 'react'
import { Button, Modal, Text } from '@mantine/core'
import { X, Check } from 'tabler-icons-react'
import {
  createHackathonParticipant,
  deleteParticipant,
} from '../actions/ParticipantActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { JOIN_BUTTON_COLOR, LEAVE_BUTTON_COLOR } from '../common/colors'
import { Hackathon, ParticipantPreview } from '../common/types'
import { useMsal } from '@azure/msal-react'
import { styles } from '../common/styles'

type IProps = {
  participantInfo: {
    userId: string
    hackathonId: string
    participantId: string
  }
  setParticipantInfo: React.Dispatch<
    React.SetStateAction<{
      userId: string
      hackathonId: string
      participantId: string
    }>
  >
  participantCheck: boolean
  setParticipantCheck: (participantCheck: boolean) => void
  buttonIsDisabled: boolean
  setButtonIsDisabled: (buttonIsDisabled: boolean) => void
  hackathonData: Hackathon
}

export default function ParticipantManager({
  participantInfo,
  setParticipantInfo,
  participantCheck,
  setParticipantCheck,
  buttonIsDisabled,
  setButtonIsDisabled,
  hackathonData,
}: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const [removeParticipantModalOpened, setRemoveParticipantModalOpened] =
    useState(false)

  const findParticipant = () => {
    let participant: ParticipantPreview
    if (hackathonData.participants) {
      participant = hackathonData.participants.find(
        (p) => p.user.id === participantInfo.userId
      )!
    } else {
      participant = {
        id: '',
        user: {
          id: '',
        },
      } as ParticipantPreview
    }
    return participant
  }

  useEffect(() => {
    const participant = findParticipant()
    setParticipantInfo({ ...participantInfo, participantId: participant?.id })
  }, [hackathonData])

  const addHackathonParticipant = () => {
    setButtonIsDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: 'Join Hackathon',
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    createHackathonParticipant(
      instance,
      participantInfo.userId,
      participantInfo.hackathonId
    ).then((response) => {
      setButtonIsDisabled(false)
      setParticipantInfo((prevState) => ({
        ...prevState,
        participantId: response.id,
      }))
      if (JSON.stringify(response).toString().includes('error')) {
        setParticipantCheck(false)
        updateNotification({
          id: 'participant-load',
          color: 'red',
          title: 'Failed to join Hackathon',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        setParticipantCheck(true)
        updateNotification({
          id: 'participant-load',
          color: 'teal',
          title: 'Joined Hackathon',
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
      }
    })
  }

  const removeHackathonParticipant = () => {
    setButtonIsDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: 'Leave Hackathon',
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    deleteParticipant(instance, findParticipant().id).then((response) => {
      setButtonIsDisabled(false)
      if (JSON.stringify(response).toString().includes('error')) {
        setParticipantCheck(true)
        updateNotification({
          id: 'participant-load',
          color: 'red',
          title: 'Failed to leave Hackathon',
          message: undefined,
          icon: <X />,
          autoClose: 2000,
        })
      } else {
        setParticipantCheck(false)
        updateNotification({
          id: 'participant-load',
          color: 'teal',
          title: 'Left Hackathon',
          message: undefined,
          icon: <Check />,
          autoClose: 2000,
        })
      }
    })
    setRemoveParticipantModalOpened(false)
  }

  return (
    <div>
      <Modal
        centered
        opened={removeParticipantModalOpened}
        onClose={() => setRemoveParticipantModalOpened(false)}
        withCloseButton={false}
      >
        <Text className={classes.text}>
          Are you sure you want to leave this hackathon? All your progress and
          ideas will be lost!
        </Text>
        <Text className={classes.title}>Title: {hackathonData.title}</Text>
        <Text className={classes.title}>
          Start Date:
          {new Date(hackathonData.startDate).toDateString()}
        </Text>
        <Text className={classes.title}>
          End Date:
          {new Date(hackathonData.endDate).toDateString()}
        </Text>
        <Button
          style={{ backgroundColor: LEAVE_BUTTON_COLOR }}
          onClick={() => removeHackathonParticipant()}
        >
          Yes, leave hackathon
        </Button>
      </Modal>

      <Button
        ml={10}
        disabled={buttonIsDisabled}
        onClick={
          participantCheck
            ? () => setRemoveParticipantModalOpened(true)
            : addHackathonParticipant
        }
        style={{
          backgroundColor: participantCheck
            ? LEAVE_BUTTON_COLOR
            : JOIN_BUTTON_COLOR,
        }}
      >
        {participantCheck ? 'Leave Hackathon' : 'Join Hackathon'}
      </Button>
    </div>
  )
}
