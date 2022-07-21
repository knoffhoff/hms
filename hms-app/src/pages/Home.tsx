import React, { useEffect, useState } from 'react'
import {
  Stepper,
  Title,
  Text,
  Container,
  SimpleGrid,
  Card,
} from '@mantine/core'
import { styles } from '../common/styles'
import { useAppSelector } from '../hooks'
import { qAndAList } from '../common/HomeQandAContent'
import { RichTextEditor } from '@mantine/rte'

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
    openDate.setDate(openDate.getDate() - 10)
    setRegistration({
      openDate: openDate,
      closeDate: new Date(nextHackathon.startDate),
    })
    console.log(nextHackathon)
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
    return nextHackathon.id ? new Date(nextHackathon.startDate).getTime() : 0
  }

  function timeTillNextHackathonEnd() {
    return nextHackathon.id ? new Date(nextHackathon.endDate).getTime() : 0
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
    <Stepper iconSize={35} active={active} breakpoint='sm' py={50}>
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
            {nextHackathon.title}
          </Text>
          <Text align={'center'} className={classes.title}>
            {new Date(nextHackathon.startDate).toLocaleDateString()} -{' '}
            {new Date(nextHackathon.endDate).toLocaleDateString()}
          </Text>
          <Container>
            <RichTextEditor
              readOnly
              value={nextHackathon.description!}
              onChange={() => {return null}}
            >
              {nextHackathon.description}
            </RichTextEditor>
          </Container>
          {timelineStepper}
        </div>
      }

      <Container fluid>
        <SimpleGrid cols={2} pt={20}>
          {qAndAList.map((qAndA, index) => (
            <Card shadow='sm' p='lg' key={index}>
              <Text weight={800} pb={10}>
                {qAndA.question}
              </Text>

              <Text size='sm' style={{ lineHeight: 1.5 }}>
                {qAndA.answer}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </>
  )
}

export default Home
