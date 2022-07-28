import React, { useEffect, useState } from 'react'
import {
  Stepper,
  Title,
  Text,
  Container,
  SimpleGrid,
  Card,
  Center,
  useMantineColorScheme,
} from '@mantine/core'
import { styles } from '../common/styles'
import { useAppSelector } from '../hooks'
import { qAndAList } from '../common/HomeQandAContent'
import { RichTextEditor } from '@mantine/rte'
import Countdown from 'react-countdown'
import HeroHeader from '../components/HeroHeader'

function Home() {
  const theme = useMantineColorScheme()
  const { classes } = styles()
  const [active, setActive] = useState(0)
  const [timeUntilNextHackathon, setTimeUntilNextHackathon] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
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
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)
    return { days, hours, minutes, seconds }
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
      <HeroHeader nextHackathon={nextHackathon} />

      <Container fluid mb={150} mt={20}>
        <Title align={'center'} mb={20} order={2}>
          Frequently Asked Questions
        </Title>
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
