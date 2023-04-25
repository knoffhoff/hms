import { useState } from 'react'
import { Idea, IdeaCardType } from '../../common/types'
import {
    Accordion,
    Avatar,
    Badge,
    Button,
    Card,
    Group,
    Modal,
    Spoiler,
    Stack,
    Text,
    Tooltip,
    useMantineTheme,
  } from '@mantine/core'
import { styles } from '../../common/styles'
import {
    DELETE_BUTTON_COLOR,
    JOIN_BUTTON_COLOR,
    LEAVE_BUTTON_COLOR,
  } from '../../common/colors'
import CardButtons from './CardButton'


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
const [buttonIsDisabled, setButtonisDisabled] = useState(false)
const [ideaData, setIdeaData] = useState(idea)

const ideaName = () => {
    return (
        <Group position='left'>
            <Stack align={'center'} spacing={'xs'}>
            <Avatar color='indigo' radius='xl' size='md'>
                {idea.getInitials(
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
    
}

const ideaProblem = () => {
    <Card.Section className={classes.borderSection}>
          <Text className={classes.label}>Problem</Text>
          <Text className={classes.text}>{ideaData.problem}</Text>
    </Card.Section>
}

const ideaGoal = () => {
    <Card.Section className={classes.borderSection}>
          <Text className={classes.label}>Goal</Text>
          <Text className={classes.text}>{ideaData.goal}</Text>
    </Card.Section>
}

const ideaCategory = () => {
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
    <Card.Section className={classes.borderSection}>
        {ideaRequiredSkills()}
    </Card.Section>
}

const ideaButtons = () => {
    return (
        <CardButtons
            idea = {props.idea}
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
            //<Text className={classes.text}>{ideaData.description}</Text>
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
}

const ideaVoteButton = () => {
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
} 




return (
    !isLoading && type === IdeaCardType.IdeaPortal && (
    <Card withBorder className={classes.card}>
      <Spoiler maxHeight={145} showLabel='Show more' hideLabel='Hide'>
        <Card.Section className={classes.borderSection}>
          <Group noWrap mb={5} position='apart'>
            {ideaName}
             

            {hackathonVotingOpened && (
    //           <Card.Section className={classes.noBorderSection}>
    //             <Stack align={'center'} spacing={'xs'}>
    //               <Text className={classes.label}>Votes: </Text>
    //               <Text className={classes.text}>
    //                 {ideaData.voters?.length}
    //               </Text>
    //             </Stack>
    //           </Card.Section>
    //         )}
    //       </Group>

    //       <Text className={classes.text}>{ideaData.description}</Text>
    //     </Card.Section>
    //   </Spoiler>
            )

      {type !== IdeaCardType.Voting && (
        <>
        //   <Card.Section className={classes.borderSection}>
        //     {skillsRequired}
        //   </Card.Section>

          <Accordion
            onChange={(value) => setAccordionOpen(value === 'idea-details')}
          >
            <Accordion.Item
              className={classes.noBorderAccordion}
              value={'idea-details'}
            >
              <Accordion.Control>
                {!accordionOpen && 'Show details'}
                {accordionOpen && 'Hide details'}
              </Accordion.Control>
              <Accordion.Panel>
                <div>{ideaDetails()}</div>

                {ideaParticipate()}

            {voteCheck ? 'Remove Vote' : 'Vote for Idea'}
                        </Button>
                      )}
                      <CardButton idea={props.idea} />
                    </Group>
                  )}

                {type === IdeaCardType.Admin ||
                  (type === IdeaCardType.Owner &&
                    ideaData.owner?.id === user?.id && (
                      <CardButton idea={props.idea} />
                    ))}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <Card.Section className={classes.borderSection}>
            <IdeaCommentDetails ideaId={ideaData.id} />
          </Card.Section>
        </>
      )}
    </Card>
  )}
  )
                    }
