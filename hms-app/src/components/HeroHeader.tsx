import {
  Button,
  Card,
  Container,
  createStyles,
  SimpleGrid,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import Countdown from 'react-countdown'
import React, { useMemo } from 'react'
import { HackathonSerializable } from '../common/types'
import { blue3, orange3 } from '../common/colors'
import { Link } from 'react-router-dom'
import { MIN_DATE } from '../common/constants'

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: 60, // from 120
    paddingBottom: 40, // from 80

    '@media (max-width: 755px)': {
      paddingTop: 40, // from 80
      paddingBottom: 30, // from 60
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

  smallerText: {
    textAlign: 'center',
    fontSize: 20,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    '@media (max-width: 520px)': {
      fontSize: 18,
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

  centeredText: {
    textAlign: 'center',
    marginTop: '20px',
  },
}))

const InfoCard = (props: {
  title: string
  description: string
  link: string
  buttonText: string
}) => {
  const theme = useMantineColorScheme()
  const { classes } = useStyles()
  return (
    <Card withBorder shadow='sm' p='lg'>
      <Title align={'center'} order={3}>
        {props.title}
      </Title>
      <Text align={'center'}>{props.description}</Text>
      <div className={classes.centeredText}>
        <Button
          size='xs'
          component={Link}
          to={props.link}
          color={theme.colorScheme === 'dark' ? 'orange' : 'blue'}
        >
          {props.buttonText}
        </Button>
      </div>
    </Card>
  )
}

const HeroHeader = (props: {
  nextHackathon: HackathonSerializable
  lastHackathon: HackathonSerializable
}) => {
  const { classes } = useStyles()

  // Using useMemo for performance
  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  return (
    <Container className={classes.wrapper} size={1400}>
      <div className={classes.inner}>
        <Title className={classes.title} order={2} align={'center'}>
          Welcome to the Ideation Portal
        </Title>
        <Text align={'center'} mb={20}>
          Your digital space for collecting, sharing, and exploring ideas
        </Text>
      </div>

      {!props.nextHackathon || !props.lastHackathon ? (
        <div>Something went wrong...</div>
      ) : (
        <div className={classes.inner}>
          <Text className={classes.smallerText}>
            Last Hackathon:{' '}
            <Text component='span' className={classes.highlight} inherit>
              {props.lastHackathon.title}
            </Text>
          </Text>

          {new Date(props.lastHackathon.endDate) < MIN_DATE ? (
            ''
          ) : (
            <Text className={classes.smallerText}>
              Ended on:{' '}
              {new Date(props.lastHackathon.endDate).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                }
              )}
            </Text>
          )}

          <Text className={classes.smallerText}>
            Next Hackathon:{' '}
            <Text component='span' className={classes.highlight} inherit>
              {props.nextHackathon.title}
            </Text>
          </Text>

          {new Date(props.nextHackathon.startDate) > today ? (
            <Text className={classes.smallerText}>
              Starts in: <Countdown date={props.nextHackathon.startDate} />
            </Text>
          ) : (
            <Text className={classes.smallerText}>
              {today < new Date(props.nextHackathon.endDate) &&
                'Ends in:' + <Countdown date={props.nextHackathon.endDate} />}
            </Text>
          )}
        </div>
      )}

      <SimpleGrid cols={3} pt={20}>
        <InfoCard
          title='Idea Pool'
          description='Discover the Idea Pool, our space where you can share your ideas.'
          link='/idea-pool'
          buttonText='Explore the Idea Pool'
        />

        <InfoCard
          title='Hackathons'
          description='Participate in one of our Hackathons and take your ideas to the next level.'
          link='/hackathons'
          buttonText='Join our Hackathons'
        />

        <InfoCard
          title='Archive'
          description='Browse our archive of past Hackathons and ideas.'
          link='/archive'
          buttonText='View our Archive'
        />
      </SimpleGrid>
    </Container>
  )
}

export default HeroHeader
