import {
  ActionIcon,
  Center,
  createStyles,
  Group,
  Progress,
  Text,
} from '@mantine/core'
import Countdown, { CountdownApi } from 'react-countdown'
import { PlayerPause, PlayerPlay, PlayerStop } from 'tabler-icons-react'
import { useEffect, useReducer, useState } from 'react'

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

function PitchTimer(pitchTime: PitchTimerProps) {
  const pitchTimeInMillis = getMillis(pitchTime.minutes, pitchTime.seconds)
  const pitchTimeInSeconds = pitchTime.minutes * 60 + pitchTime.seconds
  const { classes } = useStyles()
  const [date, setDate] = useState(Date.now() + pitchTimeInMillis)
  const [countdownApi, setCountdownApi] = useState<CountdownApi>()
  const [, forceUpdate] = useReducer((x) => x + 1, 0)
  const [progress, setProgress] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(pitchTimeInSeconds)

  useEffect(() => {
    setProgress(getPercentageFromTimeLeft())
  }, [secondsLeft])

  const getPercentageFromTimeLeft = () => {
    return Math.floor(100 - (secondsLeft / pitchTimeInSeconds) * 100)
  }

  const renderer = ({ minutes, seconds, completed }: RendererProps) => {
    setSecondsLeft(minutes * 60 + seconds)
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
    setDate(Date.now() + pitchTimeInMillis)
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
      {secondsLeft > 0 && secondsLeft < 4 && (
        <div
          className={`${classes.fullscreenOverlay} ${
            secondsLeft > 1 ? classes.bgOrange : classes.bgRed
          }`}
        >
          <Center>
            <span className={classes.fullscreenCounter}>{secondsLeft}</span>
          </Center>
        </div>
      )}
    </div>
  )
}

export default PitchTimer
