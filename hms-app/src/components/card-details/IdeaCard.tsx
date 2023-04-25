import { useContext, useEffect, useState } from 'react'
import {
    Category,
    Idea,
    IdeaCardType,
    IdeaFormType,
    Skill,
  } from '../../common/types'
import {
    Accordion,
    Avatar,
    Badge,
    Button,
    Card,
    CardSection,
    Group,
    Modal,
    Spoiler,
    Stack,
    Text,
    Tooltip,
    useMantineTheme,
  } from '@mantine/core'
import {
    createIdeaParticipant,
    createIdeaVoteParticipant,
    removeIdeaParticipant,
    removeIdeaVoteParticipant,
} from '../../actions/ParticipantActions'
import { styles } from '../../common/styles'
import {
    DELETE_BUTTON_COLOR,
    JOIN_BUTTON_COLOR,
    LEAVE_BUTTON_COLOR,
  } from '../../common/colors'
import { getIdeaDetails } from '../../actions/IdeaActions'
import { getCategoryDetails } from '../../actions/CategoryActions'
import { getSkillDetails } from '../../actions/SkillActions'
import CardButton from './CardButton'
import IdeaCommentDetails from './IdeaCommentDetails'
import { AccordionControl } from '@mantine/core/lib/Accordion/AccordionControl/AccordionControl'
import { AccordionPanel } from '@mantine/core/lib/Accordion/AccordionPanel/AccordionPanel'
import { useMsal } from '@azure/msal-react'
import { UserContext } from '../../pages/Layout'
import { AccordionItem } from '@mantine/core/lib/Accordion/AccordionItem/AccordionItem'
const MAX_TITLE_LENGTH = 100


type IProps = {
    type: IdeaCardType
    idea: Idea
    isLoading: boolean
}

export default function IdeaCard (props: IProps) {
    const { idea, type, isLoading } = props
    const { classes } = styles()
    const [participantCheck, setParticipantCheck] = useState(false)
    const [voteCheck, setVoteCheck] = useState(false)
    const user = useContext(UserContext)
    const theme = useMantineTheme()
    const [buttonIsDisabled, setButtonisDisabled] = useState(false)
    const { instance } = useMsal()
    const [accordionOpen, setAccordionOpen] = useState(false)
    const [ideaData, setIdeaData] = useState(idea)
    const [loader, setLoader] = useState(false)
    const [skillData, setSkillData] = useState([] as Skill[])
    const [categoryData, setCategoryData] = useState({} as Category)


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

    const loadCategoryDetails = () => {
        if (ideaData.category)
          getCategoryDetails(instance, ideaData.category.id).then((data) => {
            setCategoryData(data)
          })
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

    const loadSkillDetails = () => {
    ideaData.requiredSkills?.map((skills) => {
        getSkillDetails(instance, skills.id).then((data) => {
        setSkillData((skillData) => [...skillData, data])
        })
    })
    }

    const getSkillDescription = (id: string) => {
    const skill = skillData.find((skill) => skill.id === id)
    if (skill) {
        return skill.description
    }
    return null
    }
      
    const ideaName = () => {
    return (
        <Group position='left'>
            <Stack align={'center'} spacing={'xs'}>
            <Avatar color='indigo' radius='xl' size='md'>
                {getInitials(
                ideaData.owner?.firstName,
                ideaData.owner?.lastName
                )}
            </Avatar>
            <Badge size='sm'>
                {ideaData.owner?.firstName} {ideaData.owner?.lastName}
            </Badge>
            </Stack>
            <Text className={classes.title}>
            {ideaData.title?.slice(0, MAX_TITLE_LENGTH)}
            {ideaData.title?.length > MAX_TITLE_LENGTH ? '...' : ''}
            </Text>
        </Group> 
    )
        
    }
    
    const ideaDescription = () => {
        return (
            <Text className={classes.text}> 
                {ideaData.description}
            </Text>
        )
    }

    const ideaProblem = () => {
        return (
            <Card.Section className={classes.borderSection}>
                <Text className={classes.label}>Problem</Text>
                <Text className={classes.text}>{ideaData.problem}</Text>
            </Card.Section>
        )
        
    }

    const ideaGoal = () => {
        return (
            <Card.Section className={classes.borderSection}>
                <Text className={classes.label}>Goal</Text>
                <Text className={classes.text}>{ideaData.goal}</Text>
            </Card.Section>
        )
        
    }

    const ideaCategory = () => {
        return (
            <Card.Section className={classes.borderSection}>
                <Text className={classes.label}>Category</Text>
                <Tooltip
                    multiline
                    width={220}
                    transition='fade'
                    transitionDuration={200}
                    color='gray'
                    label={categoryData.description}
                >
                    <Badge
                    color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                    key={ideaData.category?.id}
                    >
                    {ideaData.category?.title}
                    </Badge>
                </Tooltip>
            </Card.Section>
        )
        
    }

    const ideaRequiredSkills = () => {
        return (
            <div>
                <Text className={classes.label}>Skills required</Text>
                <Group spacing={7} mt={5}>
                    {ideaData.requiredSkills?.map((skill) => (
                    <Tooltip
                        multiline
                        width={220}
                        transition='fade'
                        transitionDuration={200}
                        color='gray'
                        label={getSkillDescription(skill.id)}
                        key={skill.id}
                    >
                        <Badge
                        color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                        key={skill.id}
                        >
                        {skill.name}
                        </Badge>
                    </Tooltip>
                    ))}
                </Group>
            </div>
            )
    }

    const ideaSkills = ()  => {
        return (
            <Card.Section className={classes.borderSection}>
                {ideaRequiredSkills()}
            </Card.Section>
        )
        
    }

    const ideaButtons = () => {
        return (
            <CardButton
                idea = {props.idea}
                reloadIdeaDetails={loadIdeaData}
            />
        )
    }

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
                // <Text className={classes.text}>{ideaData.description}</Text>
        )
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

    const ideaParticipants = () => {
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

    useEffect(() => {
        loadIdeaData()
        }, [loader])

    useEffect(() => {
        loadCategoryDetails()
        loadSkillDetails()
        }, [])

    return (
        <>
            { !isLoading && type === IdeaCardType.IdeaPortal && type === IdeaCardType.AllIdeas || (
                <Card withBorder className={classes.card}>
                    <Spoiler maxHeight={145} showLabel='Show more' hideLabel='Hide'>
                        <Card.Section className={classes.borderSection}>
                            <Group noWrap mb={5} position='apart'>
                                { ideaName() }
                            </Group>
                            { ideaDescription() }
                        </Card.Section>
                    </Spoiler>

                    <Accordion
                        onChange={(value) => setAccordionOpen(value === 'idea-details')}>
                        <Accordion.Item
                            className={classes.noBorderAccordion}
                            value={'idea-details'}
                        >
                        <Accordion.Control>
                            {!accordionOpen && 'Show details'}
                            {accordionOpen && 'Hide details'}
                        </Accordion.Control>
                        <Accordion.Panel>
                            { ideaCategory() }
                            { ideaSkills() }
                            { ideaProblem() }
                            { ideaGoal() }
                        </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>

                    { ideaButtons() }
                </Card>
                )
            }
        </>
    )
}
