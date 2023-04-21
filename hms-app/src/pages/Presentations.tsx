import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ActionIcon,
  Badge,
  Button,
  Container,
  createStyles,
  Grid,
  Group,
  NumberInput,
  Text,
  Title,
} from '@mantine/core'
import { useFullscreen } from '@mantine/hooks'
import { Idea, IdeaPreview } from '../common/types'
import Carousel from 'nuka-carousel'
import { getIdeaDetails, getIdeaList } from '../actions/IdeaActions'
import { useAppSelector } from '../hooks'
import { useMsal } from '@azure/msal-react'
import { ArrowLeft, ArrowNarrowRight, PlayerPlay } from 'tabler-icons-react'
import { blue4, dark2, orange3, PAGE_BACKGROUND_DARK } from '../common/colors'
import PitchTimer from '../components/PitchTimer'
import { CurrentHackathonContext } from './Layout'

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
    padding: '150px 100px',
  },

  title: {
    color: _theme.white,
    fontFamily: `Greycliff CF, ${_theme.fontFamily}`,
    fontWeight: 900,
    lineHeight: 1.05,
    maxWidth: 1200,
    fontSize: 58,

    [_theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      fontSize: 34,
      lineHeight: 1.15,
    },
  },

  name: {
    color: orange3,
    fontSize: 35,
  },

  description: {
    maxWidth: 1000,
  },

  text: {
    color: _theme.white,
    opacity: 0.75,
    fontSize: 24,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',

    [_theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
    },
  },

  subTitle: {
    fontSize: 35,
    opacity: 1,
  },

  card: {
    borderRadius: 20,
    backgroundColor: blue4,
    padding: '20px 30px',
  },
}))

export default function Presentations() {
  const { classes } = useStyles()
  const { instance } = useMsal()
  const currentHackathon = useContext(CurrentHackathonContext)
  const nextHackathon = useAppSelector(
    (state) => state.hackathons.nextHackathon
  )
  const { ref, toggle, fullscreen } = useFullscreen()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [timerValue, setTimerValue] = useState({ minutes: 2, seconds: 0 })

  useEffect(() => {
    const ideaLocalStorage = () => {
      const ideaStorage = localStorage.getItem('ideas')
      if(ideaStorage){
        return setIdeas(JSON.parse(ideaStorage))
      }
      return null
    }

    ideaLocalStorage()
  }, [])

  const ideaList = ideas?.map((idea) => {
    return (
      <Container key={idea.id} className={classes.idea} fluid>
        <Badge
          fullWidth={false}
          color={'gray'}
          my={20}
          size={'lg'}
          variant={'outline'}
        >
          {idea.category?.title}
        </Badge>
        <Title className={classes.title} mb={10}>
          {idea.title}
        </Title>
        <Title
          order={2}
          className={classes.name}
        >{`by ${idea.owner?.firstName} ${idea.owner?.lastName}`}</Title>
        <Text className={`${classes.text} ${classes.description}`} mt={30}>
          {idea.description}
        </Text>
        <Grid grow justify={'center'} align={'center'} mt={100}>
          <Grid.Col span={5} pr={30} className={classes.card}>
            <Title order={3} className={`${classes.text} ${classes.subTitle}`}>
              🤔 Problem
            </Title>
            <Text className={classes.text}>{idea.problem}</Text>
          </Grid.Col>
          <Grid.Col span={2} px={50}>
            <ArrowNarrowRight size={'100%'} color={dark2} />
          </Grid.Col>
          <Grid.Col span={5} pl={30} className={classes.card}>
            <Title order={3} className={`${classes.text} ${classes.subTitle}`}>
              🚀 Goal
            </Title>
            <Text className={classes.text}>{idea.goal}</Text>
          </Grid.Col>
        </Grid>
      </Container>
    )
  })

  return (
    <>
      <Button component={Link} to='/admin' leftIcon={<ArrowLeft />}>
        Admin
      </Button>
      <Title my={20} order={1}>
        Pitch presentation
      </Title>
      <Text size={'lg'} weight={600}>
        Set time per pitch
      </Text>
      <Group mb={40} mt={10}>
        <NumberInput
          defaultValue={timerValue.minutes}
          label={'Minutes'}
          size={'md'}
          min={0}
          max={59}
          required
          onChange={(val) => {
            setTimerValue({ ...timerValue, minutes: val || 0 })
          }}
        />
        <NumberInput
          defaultValue={timerValue.seconds}
          label={'Seconds'}
          size={'md'}
          min={0}
          max={59}
          required
          onChange={(val) => {
            setTimerValue({ ...timerValue, seconds: val || 0 })
          }}
        />
      </Group>
      <ActionIcon
        color={'green'}
        size={100}
        variant={'filled'}
        onClick={toggle}
      >
        <PlayerPlay size={40} />
      </ActionIcon>

      <div ref={ref}>
        {fullscreen && (
          <div className={classes.fullscreen}>
            <PitchTimer
              minutes={timerValue.minutes}
              seconds={timerValue.seconds}
            />
            <Carousel enableKeyboardControls>{ideaList}</Carousel>
          </div>
        )}
      </div>
    </>
  )
}
