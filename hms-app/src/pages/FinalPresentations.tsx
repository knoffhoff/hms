import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ActionIcon,
  Button,
  createStyles,
  Group,
  NumberInput,
  Text,
  Title,
} from '@mantine/core'
import { useFullscreen } from '@mantine/hooks'
import { Idea } from '../common/types'
import Carousel from 'nuka-carousel'
import { ArrowLeft, PlayerPlay } from 'tabler-icons-react'
import { blue4, orange3, PAGE_BACKGROUND_DARK } from '../common/colors'
import PitchTimer from '../components/PitchTimer'
import FinalPresentationSlide from '../components/FinalPresentationSlide'

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
    padding: '20px',
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

export default function FinalPresentations() {
  const { classes } = useStyles()
  const { ref, toggle, fullscreen } = useFullscreen()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [timerValue, setTimerValue] = useState({ minutes: 2, seconds: 0 })

  useEffect(() => {
    const ideaLocalStorage = () => {
      const ideaStorage = localStorage.getItem('ideas')
      if (ideaStorage) {
        return setIdeas(JSON.parse(ideaStorage))
      }
      return null
    }

    ideaLocalStorage()
  }, [])

  const ideaList = ideas?.map((idea) => {
    return (
      <FinalPresentationSlide idea={idea} classes={classes} key={idea.id} />
    )
  })

  return (
    <>
      <Button component={Link} to='/admin' leftIcon={<ArrowLeft />}>
        Admin
      </Button>
      <Title my={20} order={1}>
        Final presentation
      </Title>
      <Text size={'lg'} weight={600}>
        Set time per presentation
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
