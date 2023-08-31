import {
  Button,
  Card,
  Container,
  SimpleGrid,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import React, { useMemo } from 'react'
import { HackathonSerializable } from '../common/types'
import { Link } from 'react-router-dom'
import { MAX_DATE, MIN_DATE } from '../common/constants'
import { heroHeaderStyles } from '../common/styles'

const InfoCard = (props: {
  title: string
  description: string
  link: string
  buttonText: string
}) => {
  const theme = useMantineColorScheme()
  const { classes } = heroHeaderStyles()
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
  const { classes } = heroHeaderStyles()

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
              ? props.date > MAX_DATE
                ? 'Starts: TBA'
                : 'Starts: ' +
                  props.date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric',
                  })
              : props.date < MIN_DATE
              ? 'Unknown'
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
  const { classes } = heroHeaderStyles()

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
