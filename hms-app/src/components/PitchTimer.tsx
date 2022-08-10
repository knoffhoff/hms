import {
  ActionIcon,
  Center,
  createStyles,
  Group,
  Progress,
  Text,
  Title,
} from '@mantine/core'
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

  fullscreenOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 2,
  },

  bgRed: {
    background: 'radial-gradient(rgba(255,52,52,0.3), rgba(255,52,52,1))',
  },

  bgOrange: {
    background: 'radial-gradient(rgba(255,125,25,0.3), rgba(255,125,25,1))',
  },

  fullscreenCounter: {
    fontSize: 150,
    fontWeight: 'bold',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },

  progress: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
  },
}))

const getMillis = (minutes: number, seconds: number) => {
  return minutes * 60000 + seconds * 1000
}

const getSeconds = (millis: number) => {
  return Math.floor(millis / 1000)
}

function PitchTimer(time: PitchTimerProps) {
  const timeInMillis = getMillis(time.minutes, time.seconds)
  const { classes } = useStyles()
  const [date, setDate] = useState(Date.now() + timeInMillis)
  const [countdownApi, setCountdownApi] = useState<CountdownApi>()
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timeInMillis)

  const getPercentageFromTimeLeft = (minutes: number, seconds: number) => {
    const timeLeft = getMillis(minutes, seconds)
    return Math.floor(100 - (timeLeft / timeInMillis) * 100)
  }

  const renderer = ({ minutes, seconds, completed }: RendererProps) => {
    setProgress(getPercentageFromTimeLeft(minutes, seconds))
    setTimeLeft(getMillis(minutes, seconds))
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
      <Progress
        className={classes.progress}
        value={progress}
        color={isCompleted() ? 'red' : 'gray'}
        radius={0}
      />
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
      {timeLeft > 0 && timeLeft < 4000 && (
        <div
          className={`${classes.fullscreenOverlay} ${
            timeLeft > 1000 ? classes.bgOrange : classes.bgRed
          }`}
        >
          <Center>
            <span className={classes.fullscreenCounter}>
              {getSeconds(timeLeft)}
            </span>
          </Center>
        </div>
      )}
    </div>
  )
}

export default PitchTimer
