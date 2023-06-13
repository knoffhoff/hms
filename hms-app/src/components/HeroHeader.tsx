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
    paddingTop: 80,
    paddingBottom: 60,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',

    '@media (max-width: 755px)': {
      paddingTop: 40,
      paddingBottom: 30,
    },
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 46,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 32,
    },
  },

  smallerText: {
    textAlign: 'center',
    fontSize: 20,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    '@media (max-width: 520px)': {
      fontSize: 18,
    },
  },

  highlight: {
    color: theme.colorScheme === 'dark' ? orange3 : blue3,
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',

    '@media (max-width: 520px)': {
      flexDirection: 'column',
    },
  },

  centeredText: {
    textAlign: 'center',
    marginTop: '20px',
  },

  hackathonHighlight: {
    color: theme.colorScheme === 'dark' ? orange3 : blue3,
    cursor: 'pointer',
    textDecoration: 'underline',
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },

  buttonArea: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: theme.spacing.sm,
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
    <Card withBorder shadow='md' p='lg'>
      <div className={classes.cardContent}>
        <div>
          <Title align={'center'} order={3}>
            {props.title}
          </Title>
          <Text align={'center'}>{props.description}</Text>
        </div>
        <div className={classes.buttonArea}>
          <Button
            size='sm'
            component={Link}
            to={props.link}
            color={theme.colorScheme === 'dark' ? 'orange' : 'blue'}
          >
            {props.buttonText}
          </Button>
        </div>
      </div>
    </Card>
  )
}

const HackathonCard = (props: {
  title: string
  hackathonTitle: string
  subtitle: string
  date: Date
  actionLink: string
  actionText: string
  upcoming?: boolean
}) => {
  const theme = useMantineColorScheme()
  const { classes } = useStyles()

  return (
    <Card withBorder shadow='md' p='lg'>
      <div className={classes.cardContent}>
        <div>
          <Title align={'center'} order={3}>
            {props.title}
          </Title>
          <Title align={'center'} order={3} className={classes.highlight}>
            {props.hackathonTitle}
          </Title>
          <Text align={'center'} size='sm'>
            {props.upcoming
              ? 'Starts: ' +
                props.date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })
              : 'Ended: ' +
                props.date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  year: 'numeric',
                })}
          </Text>
          <Text align={'center'}>{props.subtitle}</Text>
        </div>
        <div className={classes.buttonArea}>
          <Button
            size='sm'
            component={Link}
            to={props.actionLink}
            color={theme.colorScheme === 'dark' ? 'orange' : 'blue'}
          >
            {props.actionText}
          </Button>
        </div>
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
      <div>
        <Title className={classes.title} order={2} align={'center'}>
          Welcome to the Ideation Portal
        </Title>
        <Text align={'center'} mb={20}>
          Your digital space for collecting, sharing, and exploring ideas
        </Text>
      </div>

      <SimpleGrid cols={3} pt={30} spacing='md'>
        <InfoCard
          title='Idea Pool'
          description='Discover the Idea Pool, our space where you can share your ideas.'
          link='/idea-pool'
          buttonText='Explore the Idea Pool'
        />

        {props.nextHackathon &&
        new Date(props.nextHackathon.startDate) > today ? (
          <HackathonCard
            title={'Next Hackathon: '}
            hackathonTitle={props.nextHackathon.title}
            subtitle='Find out more about our upcoming hackathon.'
            date={new Date(props.nextHackathon.startDate)}
            actionLink='/hackathons'
            actionText='Join our Hackathons'
            upcoming={true}
          />
        ) : (
          <div>Something went wrong...</div>
        )}

        {props.lastHackathon &&
        new Date(props.lastHackathon.endDate) > MIN_DATE ? (
          <HackathonCard
            title={'Last Hackathon: '}
            hackathonTitle={props.lastHackathon.title}
            subtitle={'Find out more about our previous hackathon.'}
            date={new Date(props.lastHackathon.endDate)}
            actionLink='/archive'
            actionText='View our Archive'
          />
        ) : (
          <div>Something went wrong...</div>
        )}
      </SimpleGrid>
    </Container>
  )
}

export default HeroHeader
