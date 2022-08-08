import { ActionIcon, createStyles, Group, Progress, Text } from '@mantine/core'
import Countdown, { CountdownApi } from 'react-countdown'
import {
  ArrowBackUp,
  PlayerPause,
  PlayerPlay,
  PlayerSkipBack,
  PlayerStop,
} from 'tabler-icons-react'
import { useEffect, useReducer, useState } from 'react'
import { orange4 } from '../common/colors'

type PitchTimerProps = {
  minutes: number
  seconds: number
}

type RendererProps = {
  hours: number
  minutes: number
  seconds: number
  completed: boolean
}

const useStyles = createStyles((_theme, _params, getRef) => ({
  outerBox: {
    position: 'fixed',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '25px',
    zIndex: 1,
    borderRadius: '0 0 0 20px',
  },

  counterTime: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: '"Roboto", monospace',
  },

  finished: {
    color: _theme.colors.red,
  },
}))

const getMillis = (minutes: number, seconds: number) => {
  return minutes * 60 * 1000 + seconds * 1000
}

function PitchTimer(time: PitchTimerProps) {
  const timeInMillis = getMillis(time.minutes, time.seconds)
  const { classes } = useStyles()
  const [date, setDate] = useState(Date.now() + timeInMillis)
  const [countdownApi, setCountdownApi] = useState<CountdownApi>()
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const [progress, setProgress] = useState(0)

  const getPercentageFromTimeLeft = (minutes: number, seconds: number) => {
    const timeLeft = getMillis(minutes, seconds)
    return Math.floor(100 - (timeLeft / timeInMillis) * 100)
  }

  const renderer = ({ minutes, seconds, completed }: RendererProps) => {
    setProgress(getPercentageFromTimeLeft(minutes, seconds))
    return (
      <Text
        className={`${classes.counterTime} ${completed && classes.finished}`}
      >
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </Text>
    )
  }

  const handleStartClick = (): void => {
    countdownApi && countdownApi.start()
  }

  const handlePauseClick = (): void => {
    countdownApi && countdownApi.pause()
  }

  const handleResetClick = (): void => {
    setDate(Date.now() + timeInMillis)
    setProgress(0)
  }

  const handleUpdate = (): void => {
    forceUpdate()
  }

  const setRef = (countdown: Countdown | null): void => {
    if (countdown) {
      setCountdownApi(countdown.getApi())
    }
  }

  const isPaused = (): boolean => {
    return !!(countdownApi && countdownApi.isPaused())
  }

  const isStopped = (): boolean => {
    return !!(countdownApi && countdownApi.isStopped())
  }

  const isCompleted = (): boolean => {
    return !!(countdownApi && countdownApi.isCompleted())
  }

  return (
    <div className={classes.outerBox}>
      <Group>
        {isPaused() || isStopped() || isCompleted() ? (
          <ActionIcon
            color={'green'}
            variant={'transparent'}
            onClick={handleStartClick}
            size={40}
          >
            <PlayerPlay size={40} />
          </ActionIcon>
        ) : (
          <ActionIcon
            color={'green'}
            variant={'transparent'}
            onClick={handlePauseClick}
            size={40}
          >
            <PlayerPause size={40} />
          </ActionIcon>
        )}
        <ActionIcon
          color={'red'}
          variant={'transparent'}
          onClick={handleResetClick}
          size={40}
        >
          <PlayerStop size={40} />
        </ActionIcon>
        <Countdown
          key={date}
          ref={setRef}
          date={date}
          onMount={handleUpdate}
          onStart={handleUpdate}
          onPause={handleUpdate}
          onComplete={handleUpdate}
          autoStart={false}
          renderer={renderer}
        />
      </Group>
      <Progress
        value={progress}
        color={isCompleted() ? 'red' : 'gray'}
        mt={10}
      />
    </div>
  )
}

export default PitchTimer
