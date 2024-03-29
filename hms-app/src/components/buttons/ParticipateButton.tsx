import { Switch } from '@mantine/core'
import {
  createIdeaParticipant,
  removeIdeaParticipant,
} from '../../actions/ParticipantActions'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../pages/Layout'
import { HackathonParticipantContext } from '../../pages/AllIdeas'
import { getIdeaDetails } from '../../actions/IdeaActions'
import { showNotification, updateNotification } from '@mantine/notifications'
import { useMsal } from '@azure/msal-react'
import { Check, X } from 'tabler-icons-react'
import { Idea } from '../../common/types'
import { styles } from '../../common/styles'
import { LEAVE_BUTTON_COLOR, RELOAD_BUTTON_COLOR } from '../../common/colors'
import { CustomCheckIcon, CustomXIcon } from '../NotificationIcons'

type IProps = {
  idea: Idea
  onSuccess?: () => void
}

export default function ParticipateButton(props: IProps) {
  const hackathonParticipantId = useContext(HackathonParticipantContext)
  const user = useContext(UserContext)
  const { classes } = styles()
  const { instance } = useMsal()
  const { idea, onSuccess } = props
  const [ideaData, setIdeaData] = useState(idea)
  const [loader, setLoader] = useState(false)
  const [participantCheck, setParticipantCheck] = useState(false)
  const [buttonIsDisabled, setButtonisDisabled] = useState(false)
  const [participantInfo, setParticipantInfo] = useState({
    userId: '',
    participantId: '',
  })

  const addHackathonParticipant = async (
    action = createIdeaParticipant,
    check = setParticipantCheck
  ) => {
    if (participantInfo.participantId === '') {
      showNotification({
        id: 'participant-load',
        color: 'red',
        title: 'You are not participating in this hackathon!',
        message: 'You must join the hackathon first to join an idea.',
        icon: <CustomXIcon />,
        autoClose: 5000,
      })
      return
    }
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: `Joining idea "${ideaData.title}"`,
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
            title: `Failed to join idea: "${ideaData.title}"`,
            message: undefined,
            icon: <CustomXIcon />,
            autoClose: 5000,
          })
        } else {
          check(true)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: `Successfully joined idea: "${ideaData.title}"`,
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

  const addThisIdeaParticipant = async () => {
    await addHackathonParticipant(createIdeaParticipant, setParticipantCheck)
  }

  const removeHackathonParticipant = async (
    action = removeIdeaParticipant,
    check = setParticipantCheck
  ) => {
    setButtonisDisabled(true)
    showNotification({
      id: 'participant-load',
      loading: true,
      title: `Leaving idea: "${ideaData.title}"`,
      message: undefined,
      autoClose: false,
      disallowClose: false,
    })
    action(instance, ideaData.id, participantInfo.participantId).then(
      (response) => {
        setButtonisDisabled(false)
        setLoader(true)
        if (JSON.stringify(response).toString().includes('error')) {
          check(true)
          updateNotification({
            id: 'participant-load',
            color: 'red',
            title: `Failed to leave idea: "${ideaData.title}"`,
            message: undefined,
            icon: <CustomXIcon />,
            autoClose: 5000,
          })
        } else {
          check(false)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: `Successfully left idea: "${ideaData.title}"`,
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

  const removeThisIdeaParticipant = () => {
    removeHackathonParticipant(removeIdeaParticipant, setParticipantCheck)
  }

  const findParticipant = () => {
    if (ideaData && ideaData.participants && user) {
      const participant = ideaData.participants.find(
        (participant) => participant.user.id === user.id
      )
      if (participant) {
        return participant
      } else {
        return null
      }
    }
  }

  const loadIdeaData = () => {
    getIdeaDetails(instance, ideaData.id).then((data) => {
      setIdeaData(data)
      setLoader(false)
    })
  }

  useEffect(() => {
    if (user) {
      setParticipantInfo({
        userId: user.id,
        participantId: hackathonParticipantId,
      })
    }
  }, [user, hackathonParticipantId])

  useEffect(() => {
    loadIdeaData()
  }, [loader])

  useEffect(() => {
    if (findParticipant()) setParticipantCheck(!!findParticipant())
  }, [ideaData])

  return (
    <Switch
      pt={10}
      color={RELOAD_BUTTON_COLOR}
      disabled={buttonIsDisabled}
      checked={participantCheck}
      onChange={
        participantCheck ? removeThisIdeaParticipant : addThisIdeaParticipant
      }
      thumbIcon={
        participantCheck ? (
          <Check size='0.8rem' color={RELOAD_BUTTON_COLOR} />
        ) : (
          <X size='0.8rem' color={LEAVE_BUTTON_COLOR} />
        )
      }
      label={<span className={classes.boldText}>Participate</span>}
      labelPosition='left'
    />
  )
}
