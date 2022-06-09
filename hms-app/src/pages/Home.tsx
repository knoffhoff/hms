import React, { useEffect, useState } from 'react'
import { Hackathon, HackathonSerializable } from '../common/types'
import { Stepper, Title, Text, Container } from '@mantine/core'
import { styles } from '../common/styles'
import { useAppSelector } from '../hooks'

function Home() {
  const { classes } = styles()
  const [active, setActive] = useState(0)
  const [timeUntilNextHackathon, setTimeUntilNextHackathon] = useState({
    days: 0,
    hours: 0,
  })
  const [registration, setRegistration] = useState({
    openDate: new Date(),
    closeDate: new Date(),
  })

  const nextHackathon = useAppSelector(
    (state) => state.hackathons.nextHackathon
  )

  useEffect(() => {
    setTimeUntilNextHackathon(getTimeDifferenceToNow(nextHackathon.startDate))
    const openDate = new Date(nextHackathon.startDate)
    openDate.setDate(openDate.getDate() - 80)
    setRegistration({
      openDate: openDate,
      closeDate: new Date(nextHackathon.startDate),
    })
  }, [nextHackathon])

  const getTimeDifferenceToNow = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const difference = date.getTime() - now.getTime()
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    return { days, hours }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function timeTillNextHackathonStart() {
    return !!nextHackathon.id ? new Date(nextHackathon.startDate).getTime() : 0
  }

  function timeTillNextHackathonEnd() {
    return !!nextHackathon.id ? new Date(nextHackathon.endDate).getTime() : 0
  }

  function setActiveTimeline() {
    if (registration.openDate < today && registration.closeDate > today) {
      setActive(1)
    } else if (
      registration.closeDate < today &&
      new Date(nextHackathon.startDate) > today
    ) {
      setActive(2)
    } else if (
      new Date(nextHackathon.startDate) < today &&
      new Date(nextHackathon.endDate) > today
    ) {
      setActive(3)
    } else {
      setActive(4)
    }
  }

  function getLabel(LabelDate: number) {
    return (
      Math.abs((LabelDate - today.getTime()) / (1000 * 3600 * 24))
        .toString()
        .split('.')[0] +
      ' ' +
      (new Date(LabelDate) < today ? 'days ago' : 'days left')
    )
  }

  useEffect(() => {
    setActiveTimeline()
  }, [nextHackathon])

  const timelineStepper = (
    <Stepper iconSize={35} active={active} breakpoint="sm" pt={15} pb={15}>
      <Stepper.Step
        className={classes.stepperStep}
        loading={active === 0}
        label={getLabel(registration.openDate.getTime())}
        description={
          'Registration and Idea submission open ' +
          registration.openDate.toLocaleDateString()
        }
      />
      <Stepper.Step
        className={classes.stepperStep}
        loading={active === 1}
        label={getLabel(registration.closeDate.getTime())}
        description={
          'Registration and Idea submission deadline! ' +
          registration.closeDate.toLocaleDateString()
        }
      />
      <Stepper.Step
        className={classes.stepperStep}
        loading={active === 2}
        label={getLabel(timeTillNextHackathonStart())}
        description={
          'Start Date ' + new Date(nextHackathon.startDate).toLocaleDateString()
        }
      />
      <Stepper.Step
        className={classes.stepperStep}
        loading={active === 3}
        label={getLabel(timeTillNextHackathonEnd())}
        description={
          'End Date ' + new Date(nextHackathon.endDate).toLocaleDateString()
        }
      />
      <Stepper.Step
        className={classes.stepperStep}
        loading={active === 4}
        label={getLabel(timeTillNextHackathonEnd())}
        description={
          'award ceremony ' +
          new Date(nextHackathon.endDate).toLocaleDateString()
        }
      />
    </Stepper>
  )

  return (
    <>
      {
        <div>
          <Title order={1} align={'center'}>
            Upcoming Hackathon starts in
            {' ' +
              timeUntilNextHackathon.days +
              ' days ' +
              timeUntilNextHackathon.hours +
              ' hours'}
          </Title>
          <Text align={'center'} className={classes.title}>
            Title: {nextHackathon.title}
          </Text>
          <Text align={'center'} className={classes.title}>
            Start date: {new Date(nextHackathon.startDate).toLocaleDateString()}
          </Text>
          <Text align={'center'} className={classes.title}>
            End date: {new Date(nextHackathon.endDate).toLocaleDateString()}
          </Text>
          {timelineStepper}
        </div>
      }

      <Container fluid>
        <div>
          <Title>What is a Hack-week?</Title>
          <Text className={classes.text}>
            In our case, a Hack-week is more or less self - explaining ;) we
            will have a 5-Day long Hack-week that starts on Monday with Idea
            Pitches and ends on Friday with some cool project presentations and
            a winner celebration
          </Text>
        </div>
        <div>
          <Title>Why should I Participate?</Title>
          <Text className={classes.text}>
            Maybe you have a great idea that you have wanted to work on for
            years? Use the chance to build a prototype! Maybe you want to learn
            or test a new framework? Then this is your save space! You have a
            solution for an existing problem? Come and find allies for it.
          </Text>
        </div>
      </Container>

      <Container fluid>
        <div>
          <Title>How to use this site?</Title>
          <Text className={classes.text}>
            In the HMS you will be able to participate in a Hackathon, submit
            ideas, see all other ideas and vote for the best idea in the end.
          </Text>
        </div>
        <div>
          <Title>How to participate?</Title>
          <Text className={classes.text}>
            If you want to participate in a Hackathon, navigate to the Idea
            Portal page, select a Hackathon and click on the participate button
          </Text>
          ---add screenshot from header here--- ---add screenshot from dropdown
          here--- ---add screenshot from participate button here---
        </div>
        <div>
          <Title>How to find Ideas?</Title>
          <Text className={classes.text}>
            In the Idea Portal, you can select all upcoming Hackathons to see a
            list of submitted ideas. Also, you have the opportunity to search
            for specific idea titles or to only display your favorite ideas. The
            idea cards itself are expandable, so you can see all relevant
            information and also a list of already pre-registered users that
            want to participate in that idea. If you like an Idea and want to
            participate or just save it to decide later you will find a
            participate and favorite button on the bottom of every expanded idea
            card.
          </Text>
          ---add screenshot of a expanded idea card---
        </div>
        <div>
          <Title>How to submit Ideas?</Title>
          <Text className={classes.text}>
            If you are already registered for a hackathon and want to submit
            your own ideas, navigate to the "Your Ideas" page. In the "Your
            Ideas" page, you can select the Hackathon you want to submit a new
            idea or see a list of your already submitted Ideas To create a new
            Idea Select a Hackathon and then click on Create new Idea, here you
            can fill in all the relevant information. To Edit or Delete and
            already submitted idea, load the hackathon to see your ideas, then
            expand the Idea Card you want and click on the Edit or Delete button
            on the bottom.
          </Text>
          ---add a screenshot from the "create idea button" and the edit/delete
          buttons---{' '}
        </div>
        <div>
          <Title>How to find old Hackathons?</Title>
          <Text className={classes.text}>
            If you are interested in Past Hackathons or want to find an old idea
            that you remember, you can use the Archive. In the Archive you will
            find a selection of all past hackathons with their submitted ideas.
          </Text>
        </div>
        <div>
          <Title>How the Voting and the Hackathon itself will work?</Title>
          ---add explanation about the voting system--- ---add space for
          specific explanation?---
        </div>
      </Container>
    </>
  )
}

export default Home
