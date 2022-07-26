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

  function setActiveTimeline() {
    // ToDo: access Hackathon status and set active state
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
      setActive(0)
    }
  }

  useEffect(() => {
    setActiveTimeline()
  }, [nextHackathon])

  const timelineStepper = (
    <Stepper iconSize={35} active={active} breakpoint='sm' py={50}>
      <Stepper.Step
        className={classes.stepperStep}
        label={'Registration and Idea submission open '}
      />
      <Stepper.Step
        className={classes.stepperStep}
        label={'Registration and Idea submission closed! '}
      />
      <Stepper.Step
        className={classes.stepperStep}
        label={'Hackathon Started'}
      />
      <Stepper.Step className={classes.stepperStep} label={'Voting Open'} />
      <Stepper.Step
        className={classes.stepperStep}
        label={'Voting and Hackathon Ended'}
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
            {nextHackathon.description && (
              <RichTextEditor
                readOnly
                value={nextHackathon.description}
                onChange={() => {
                  return null
                }}
              >
                {nextHackathon.description}
              </RichTextEditor>
            )}
          </Container>
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
