import React, { useEffect, useState } from 'react'
import { HackathonPreview } from '../common/types'
import { createStyles, Stepper, Text, Title } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  container: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.md,
    textDecoration: 'none',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.dark[0],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
  },
}))

function Home() {
  const { classes } = useStyles()

  const [nextHackathon, setNextHackathon] = useState<HackathonPreview>({
    endDate: new Date(),
    id: '',
    startDate: new Date(),
    title: '',
  })
  const [active, setActive] = useState(0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const registrationOpenDate = new Date(nextHackathon.startDate)
  registrationOpenDate.setDate(registrationOpenDate.getDate() - 84)

  const registrationClosedDate = new Date(nextHackathon.startDate)
  registrationClosedDate.setDate(registrationClosedDate.getDate() - 77)

  function timeTillNextHackathonStart() {
    return !!nextHackathon.id ? new Date(nextHackathon.startDate).getTime() : 0
  }

  function timeTillNextHackathonEnd() {
    return !!nextHackathon.id ? new Date(nextHackathon.endDate).getTime() : 0
  }

  function setActiveTimeline() {
    if (registrationOpenDate < today && registrationClosedDate > today) {
      setActive(1)
    } else if (
      registrationClosedDate < today &&
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
    if (localStorage.getItem('nextHackathon')) {
      setNextHackathon(JSON.parse(localStorage.getItem('nextHackathon')!))
    }
  }, [])

  useEffect(() => {
    setActiveTimeline()
  }, [nextHackathon])

  const timelineStepper = (
    <Stepper iconSize={35} active={active} breakpoint="sm" pt={15} pb={15}>
      <Stepper.Step
        style={{ maxWidth: 175 }}
        loading={active === 0}
        label={getLabel(registrationOpenDate.getTime())}
        description={
          'Registration and Idea submission open ' +
          registrationOpenDate.toLocaleDateString()
        }
      />
      <Stepper.Step
        style={{ maxWidth: 175 }}
        loading={active === 1}
        label={getLabel(registrationClosedDate.getTime())}
        description={
          'Registration and Idea submission deadline! ' +
          registrationClosedDate.toLocaleDateString()
        }
      />
      <Stepper.Step
        style={{ maxWidth: 175 }}
        loading={active === 2}
        label={getLabel(timeTillNextHackathonStart())}
        description={
          'Start Date ' + new Date(nextHackathon.startDate).toLocaleDateString()
        }
      />
      <Stepper.Step
        style={{ maxWidth: 175 }}
        loading={active === 3}
        label={getLabel(timeTillNextHackathonEnd())}
        description={
          'End Date ' + new Date(nextHackathon.endDate).toLocaleDateString()
        }
      />
      <Stepper.Step
        style={{ maxWidth: 175 }}
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
      <Title order={1}>Welcome to the Hack-week Management System</Title>
      {!!localStorage.getItem('nextHackathon') && (
        <div>
          <Title order={2} style={{ textAlign: 'center' }}>
            Next Hackathon in
          </Title>
          <Title order={2} style={{ textAlign: 'center' }}>
            {
              (
                (timeTillNextHackathonStart() - today.getTime()) /
                (1000 * 3600 * 24)
              )
                .toString()
                .split('.')[0]
            }{' '}
            days and{' '}
            {Math.round(timeTillNextHackathonStart() / (1000 * 3600)) % 24}{' '}
            hours
          </Title>
          <Text>Next Hackathon: {nextHackathon.title}</Text>
          <Text>
            Start Date: {new Date(nextHackathon.startDate).toLocaleDateString()}
          </Text>
          <Text>
            End Date: {new Date(nextHackathon.endDate).toLocaleDateString()}
          </Text>
          {timelineStepper}
        </div>
      )}

      <div className={classes.container}>
        <div>
          <Title order={3}>What is a Hack-week?</Title>
          <Text>
            In our case, a Hack-week is more or less self - explaining ;) we
            will have a 5-Day long Hack-week that starts on Monday with Idea
            Pitches and ends on Friday with some cool project presentations and
            a winner celebration
          </Text>
        </div>
        <div>
          <Title order={3}>Why should I Participate?</Title>
          <Text>
            Maybe you have a great idea that you have wanted to work on for
            years? Use the chance to build a prototype! Maybe you want to learn
            or test a new framework? Then this is your save space! You have a
            solution for an existing problem? Come and find allies for it.
          </Text>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
        }}
        className={classes.container}
      >
        <div>
          <Title order={3}>How to use this site?</Title>
          <Text>
            In the HMS you will be able to participate in a Hackathon, submit
            ideas, see all other ideas and vote for the best idea in the end.
          </Text>
        </div>
        <div>
          <Title order={3}>How to participate?</Title>
          <Text>
            If you want to participate in a Hackathon, navigate to the Idea
            Portal page, select a Hackathon and click on the participate button
          </Text>
          ---add screenshot from header here--- ---add screenshot from dropdown
          here--- ---add screenshot from participate button here---
        </div>
        <div>
          <Title order={3}>How to find Ideas?</Title>
          <Text>
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
          <Title order={3}>How to submit Ideas?</Title>
          <Text>
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
          <Title order={3}>How to find old Hackathons?</Title>
          <Text>
            If you are interested in Past Hackathons or want to find an old idea
            that you remember, you can use the Archive. In the Archive you will
            find a selection of all past hackathons with their submitted ideas.
          </Text>
        </div>
        <div>
          <Title order={3}>
            How the Voting and the Hackathon itself will work?
          </Title>
          ---add explanation about the voting system--- ---add space for
          specific explanation?---
        </div>
      </div>
    </>
  )
}

export default Home
