import { useContext, useEffect, useState } from 'react'
import {
	createIdeaParticipant,
	// createIdeaVoteParticipant,
	removeIdeaParticipant,
	// removeIdeaVoteParticipant,
	} from '../../actions/ParticipantActions'
import {
	Accordion,
	Avatar,
	Button,					
	Group,
	Text,
} from '@mantine/core'
import {
		Idea,
} from '../../common/types'
import {
	JOIN_BUTTON_COLOR,
	LEAVE_BUTTON_COLOR,
} from '../../common/colors'
import { styles } from '../../common/styles'
import { UserContext } from '../../pages/Layout'
import { Check, X } from 'tabler-icons-react'
import { IProps } from './IdeaDetails' 
import { getIdeaDetails } from '../../actions/IdeaActions'
import { useMsal } from '@azure/msal-react'
import { showNotification, updateNotification } from '@mantine/notifications'

export function ParticipantsHandler(props: IProps) {
	const [participantCheck, setParticipantCheck] = useState(false)
	const [participantInfo, setParticipantInfo] = useState({
		userId: '',
		participantId: '',
	})
	const [loader, setLoader] = useState(false)
	const user = useContext(UserContext)
	const { instance } = useMsal()

	const addHackathonParticipant = async (
		action = createIdeaParticipant,
		check = setParticipantCheck
		) => {
		if (participantInfo.participantId === '') {
			showNotification({
				id: 'participant-load',
				color: 'red',
				title: 'Not participating in hackathon',
				message: 'You must join the hackathon first to join an idea.',
				icon: <X />,
				autoClose: 5000,
			})
			return
		}
		setButtonisDisabled(true)
		showNotification({
				id: 'participant-load',
				loading: true,
				title: `Updating "${ideaData.title}"`,
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
						title: 'Failed to save idea',
						message: undefined,
						icon: <X />,
						autoClose: 2000,
					})
				} else {
					check(true)
					updateNotification({
						id: 'participant-load',
						color: 'teal',
						title: `Updated idea: "${ideaData.title}"`,
						message: undefined,
						icon: <Check />,
						autoClose: 2000,
					})
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
			title: `Updating idea: "${ideaData.title}"`,
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
						title: 'Failed to save Idea',
						message: undefined,
						icon: <X />,
						autoClose: 2000,
					})
				} else {
					check(false)
					updateNotification({
						id: 'participant-load',
						color: 'teal',
						title: `Updated "${ideaData.title}"`,
						message: undefined,
						icon: <Check />,
						autoClose: 2000,
					})
				}
			}
		)
	}

	const removeThisIdeaParticipant = () => {
		removeHackathonParticipant(removeIdeaParticipant, setParticipantCheck)
	}

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

	return (
		<div></div>
	)
}

export function ideaParticipants(props: IProps) {
	const [buttonIsDisabled, setButtonisDisabled] = useState(false)
	const [participantAccordionOpen, setParticipantAccordionOpen] =
		useState(false)
	const { classes } = styles()
	const { idea } = props
	const { instance } = useMsal()
	const [ideaData, setIdeaData] = useState(idea)

	const loadIdeaData = () => {
		getIdeaDetails(instance, ideaData.id).then((data) => {
			setIdeaData(data)
			setLoader(false)
		})
	}

	const participantData = ideaData.participants?.map((participant, index) => (
		<div
			key={index}
			style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
		>
			<Avatar color='indigo' radius='xl' size='md'>
					{getInitials(participant.user.firstName, participant.user.lastName)}
			</Avatar>
			<Text className={classes.text}>
					{participant.user.firstName} {participant.user.lastName}
			</Text>
		</div>
		)
	)

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

	const ideaParticipateButton = () => {
    return (    
    <Group
    mt='xs'
    position={'right'}
    style={{ paddingTop: 5 }}
    >
    <Button
    disabled={buttonIsDisabled}
    onClick={
    participantCheck
            ? removeThisIdeaParticipant
            : addIdeaParticipant
    }
    style={{
    backgroundColor: participantCheck
            ? LEAVE_BUTTON_COLOR
            : JOIN_BUTTON_COLOR,
    }}
    >
    {participantCheck ? 'Leave Idea' : 'Join Idea'}
    </Button>
    </Group>
    )   
}

useEffect(() => {
	loadIdeaData()
}, [loader])

useEffect(() => {
	if (findParticipant()) setParticipantCheck(!!findParticipant())
	}, [ideaData])

	return (
		<Accordion
			chevronPosition={'right'}
			onChange={(value) =>
			setParticipantAccordionOpen(value === 'participants')
			}
		>
		<Accordion.Item value={'participants'}>
			<Accordion.Control>
				{!participantAccordionOpen ? (
				<div>
					<Text className={classes.label}>Current participants</Text>
					<Group spacing={7} mt={5}>
					<Avatar.Group>
						{ideaData.participants?.map((participant, index) => (
						<Avatar
							key={index}
							color='indigo'
							radius='xl'
							size='md'
						>
						{getInitials(
						participant.user.firstName,
						participant.user.lastName
						)}
						</Avatar>
						))}
					</Avatar.Group>
					</Group>
				</div>
				) : (
				<Text className={classes.label}>Current participants</Text>
				)}
			</Accordion.Control>
			<Accordion.Panel>{participantData}</Accordion.Panel>
			</Accordion.Item>
		</Accordion>
		)
}