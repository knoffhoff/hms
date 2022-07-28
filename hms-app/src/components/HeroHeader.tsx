import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  Center,
  Badge,
  useMantineColorScheme,
} from '@mantine/core'
import { Dots } from './Dots'
import Countdown from 'react-countdown'
import React from 'react'
import { HackathonSerializable } from '../common/types'
import { blue3, orange3 } from '../common/colors'
import { Link } from 'react-router-dom'

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: 120,
    paddingBottom: 80,

    '@media (max-width: 755px)': {
      paddingTop: 80,
      paddingBottom: 60,
    },
  },

  inner: {
    position: 'relative',
    zIndex: 1,
  },

  dots: {
    position: 'absolute',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

    '@media (max-width: 755px)': {
      display: 'none',
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 28,
      textAlign: 'left',
    },
  },

  highlight: {
    color: theme.colorScheme === 'dark' ? orange3 : blue3,
  },

  description: {
    textAlign: 'center',

    '@media (max-width: 520px)': {
      textAlign: 'left',
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',

    '@media (max-width: 520px)': {
      flexDirection: 'column',
    },
  },

  control: {
    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md,
    },

    '@media (max-width: 520px)': {
      height: 42,
      fontSize: theme.fontSizes.md,

      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}))

const HeroHeader = (props: { nextHackathon: HackathonSerializable }) => {
  const theme = useMantineColorScheme()
  const { classes } = useStyles()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Container className={classes.wrapper} size={1400}>
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 60, top: 0 }} />
      <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
      <Dots className={classes.dots} style={{ right: 0, top: 60 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Upcoming{' '}
          <Text component='span' className={classes.highlight} inherit>
            {props.nextHackathon.title}
          </Text>{' '}
          starts in
          <Center styles={{ color: 'red' }}>
            {today < new Date(props.nextHackathon.startDate) && (
              <Countdown date={props.nextHackathon.startDate} />
            )}
          </Center>
        </Title>

        <Center my={25}>
          <Badge
            size={'lg'}
            variant='gradient'
            gradient={
              theme.colorScheme === 'dark'
                ? { from: 'teal', to: 'blue', deg: 60 }
                : { from: '#ed6ea0', to: '#ec8c69', deg: 35 }
            }
          >
            {new Date(props.nextHackathon.startDate).toLocaleDateString()}
            {' - '}
            {new Date(props.nextHackathon.endDate).toLocaleDateString()}
          </Badge>
        </Center>

        <Container p={0} size={600}>
          <Text size='lg' color='dimmed' className={classes.description}>
            {props.nextHackathon.description}
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            component={Link}
            to='/ideas'
            className={classes.control}
            size='lg'
            variant='default'
            color='gray'
          >
            Explore ideas
          </Button>
          <Button
            className={classes.control}
            size='lg'
            component={Link}
            to='/my-ideas'
            color={theme.colorScheme === 'dark' ? 'orange' : 'blue'}
          >
            Submit project idea
          </Button>
        </div>
      </div>
    </Container>
  )
}

export default HeroHeader
