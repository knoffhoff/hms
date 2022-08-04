import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  createStyles,
  Grid,
  Group,
  SimpleGrid,
  Text,
  Title,
  Stack,
  Container,
} from '@mantine/core'
import { useFullscreen } from '@mantine/hooks'
import { Idea, IdeaPreview, UserPreview } from '../common/types'
import Carousel from 'nuka-carousel'
import { getIdeaDetails, getIdeaList } from '../actions/IdeaActions'
import { useAppSelector } from '../hooks'
import { useMsal } from '@azure/msal-react'
import { ArrowLeft, PlayerPlay } from 'tabler-icons-react'
import { orange3, PAGE_BACKGROUND_DARK } from '../common/colors'

const useStyles = createStyles((_theme, _params, getRef) => ({
  controls: {
    ref: getRef('controls'),
    transition: 'opacity 150ms ease',
    opacity: 0,
  },

  root: {
    '&:hover': {
      [`& .${getRef('controls')}`]: {
        opacity: 1,
      },
    },
  },

  fullscreen: {
    backgroundColor: PAGE_BACKGROUND_DARK,
    height: '100vh',
    width: '100vw',
    color: 'white',
  },

  idea: {
    height: '100vh',
    padding: '150px 50px',
  },

  title: {
    color: _theme.white,
    fontFamily: `Greycliff CF, ${_theme.fontFamily}`,
    fontWeight: 900,
    lineHeight: 1.05,
    maxWidth: 1000,
    fontSize: 58,

    [_theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      fontSize: 34,
      lineHeight: 1.15,
    },
  },

  description: {
    color: _theme.white,
    opacity: 0.75,
    maxWidth: 1000,
    fontSize: 24,

    [_theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
    },
  },
}))

export default function Presentations() {
  const { classes } = useStyles()
  const { instance } = useMsal()
  const nextHackathon = useAppSelector(
    (state) => state.hackathons.nextHackathon
  )
  const { ref, toggle, fullscreen } = useFullscreen()
  const [ideas, setIdeas] = useState<Idea[]>([])

  useEffect(() => {
    const fetchIdeas = async () => {
      if (nextHackathon && nextHackathon.id) {
        const ideasResult = await getIdeaList(instance, nextHackathon.id)
        const ideaDetailsResult = await Promise.all(
          ideasResult.ideas.map(async (idea: IdeaPreview) => {
            return await getIdeaDetails(instance, idea.id)
          })
        )
        setIdeas(ideaDetailsResult)
      }
    }

    fetchIdeas()
  }, [])

  const renderName = (user: UserPreview): string => {
    return user.firstName + (user.lastName ? ' ' + user.lastName : '')
  }

  const ideaList = ideas?.map((idea) => {
    return (
      <Container key={idea.id} className={classes.idea} fluid>
        <Title className={classes.title}>{idea.title}</Title>
        <Text className={classes.description} mt={30}>
          {idea.description}
        </Text>
      </Container>
    )
  })

  // function getIdeasList() {
  //   return allIdeas.map((idea: Idea, index: number) => (
  //     <div style={{ padding: 10 }} key={index}>
  //       <Card
  //         withBorder
  //         style={{ height: '99vh' }}
  //         className={classes.presentationsCards}
  //       >
  //         <Card.Section
  //           style={{ height: '6%' }}
  //           className={classes.noBorderSection}
  //         >
  //           <Text className={classes.label}>Title</Text>
  //           <div
  //             style={{
  //               backgroundColor: 'white',
  //             }}
  //           >
  //             <Text className={classes.presentationText}>{idea.title}</Text>
  //           </div>
  //         </Card.Section>
  //
  //         <Card.Section
  //           style={{ height: '25%' }}
  //           className={classes.noBorderSection}
  //         >
  //           <Grid align='center'>
  //             <Grid.Col span={8}>
  //               <Card.Section style={{ height: '100%' }}>
  //                 <Text className={classes.label}>Description</Text>
  //                 <div
  //                   style={{
  //                     height: '20vh',
  //                     backgroundColor: 'white',
  //                   }}
  //                 >
  //                   {' '}
  //                   <Text className={classes.presentationText}>
  //                     {idea.description}
  //                   </Text>
  //                 </div>
  //               </Card.Section>
  //             </Grid.Col>
  //             <Grid.Col span={4}>
  //               <Card.Section>
  //                 <Group
  //                   direction={'column'}
  //                   align={'center'}
  //                   position={'center'}
  //                   spacing={'xs'}
  //                 >
  //                   <Avatar
  //                     color='indigo'
  //                     radius='xl'
  //                     size='xl'
  //                     src={
  //                       'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4'
  //                     }
  //                   />
  //                   <Badge size='md'>
  //                     {idea.owner?.user.firstName} {idea.owner?.user.lastName}
  //                   </Badge>
  //                 </Group>
  //               </Card.Section>
  //             </Grid.Col>
  //           </Grid>
  //         </Card.Section>
  //
  //         <Card.Section
  //           style={{ height: '20%' }}
  //           className={classes.noBorderSection}
  //         >
  //           <Text className={classes.label}>Problem</Text>
  //           <div
  //             style={{
  //               backgroundColor: 'white',
  //               height: '15vh',
  //             }}
  //           >
  //             <Text className={classes.presentationText}>{idea.problem}</Text>
  //           </div>
  //         </Card.Section>
  //
  //         <Card.Section
  //           style={{ height: '20%' }}
  //           className={classes.noBorderSection}
  //         >
  //           <Text className={classes.label}>Goal</Text>
  //           <div
  //             style={{
  //               backgroundColor: 'white',
  //               height: '15vh',
  //             }}
  //           >
  //             <Text className={classes.presentationText}>{idea.goal}</Text>
  //           </div>
  //         </Card.Section>
  //
  //         <Card.Section
  //           style={{ height: '20%' }}
  //           className={classes.noBorderSection}
  //         >
  //           <Grid align={'center'}>
  //             <Grid.Col span={6}>
  //               <Card.Section>
  //                 <Text className={classes.label}>Skills</Text>
  //                 <div
  //                   style={{
  //                     paddingTop: '1px',
  //                     backgroundColor: 'white',
  //                     height: '15vh',
  //                   }}
  //                 >
  //                   <Grid>
  //                     {idea.requiredSkills?.map((skill, index) => (
  //                       <Grid.Col span={3} key={index}>
  //                         <div
  //                           style={{
  //                             display: 'flex',
  //                             alignItems: 'center',
  //                             gap: '10px',
  //                           }}
  //                         >
  //                           <Text className={classes.presentationText}>
  //                             {skill.name}
  //                           </Text>
  //                         </div>
  //                       </Grid.Col>
  //                     ))}
  //                   </Grid>
  //                 </div>
  //               </Card.Section>
  //             </Grid.Col>
  //
  //             <Grid.Col span={6}>
  //               <Card.Section>
  //                 <Text className={classes.label}>Participants</Text>
  //                 <div
  //                   style={{
  //                     paddingTop: '1px',
  //                     backgroundColor: 'white',
  //                     height: '15vh',
  //                   }}
  //                 >
  //                   <Grid>
  //                     {idea.participants?.map((participant, index) => (
  //                       <Grid.Col span={4} key={index}>
  //                         <div
  //                           style={{
  //                             display: 'flex',
  //                             alignItems: 'center',
  //                             gap: '10px',
  //                           }}
  //                         >
  //                           <Avatar
  //                             color='indigo'
  //                             radius='xl'
  //                             size='md'
  //                             src={
  //                               'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4'
  //                             }
  //                           />
  //                           <Text className={classes.presentationText}>
  //                             {renderName(participant.user)}
  //                           </Text>
  //                         </div>
  //                       </Grid.Col>
  //                     ))}
  //                   </Grid>
  //                 </div>
  //               </Card.Section>
  //             </Grid.Col>
  //           </Grid>
  //         </Card.Section>
  //       </Card>
  //     </div>
  //   ))
  // }

  return (
    <>
      <Button component={Link} to='/admin' leftIcon={<ArrowLeft />}>
        Admin
      </Button>
      <Title my={20} order={1}>
        Pitch presentation slides
      </Title>
      <ActionIcon
        color={'green'}
        size={100}
        variant={'filled'}
        onClick={toggle}
      >
        <PlayerPlay size={40} />
      </ActionIcon>

      <div ref={ref}>
        {/* <Carousel enableKeyboardControls={true}>{getIdeasList()}</Carousel> */}
        {fullscreen && (
          <div className={classes.fullscreen}>
            <Carousel enableKeyboardControls>{ideaList}</Carousel>
          </div>
        )}
      </div>
    </>
  )
}
