import React from 'react'
import { Card, Container, SimpleGrid, Text, Title } from '@mantine/core'
import { useAppSelector } from '../hooks'
import { qAndAList } from '../common/HomeQandAContent'
import HeroHeader from '../components/HeroHeader'
import { styles } from '../common/styles'

function Home() {
  const nextHackathon = useAppSelector(
    (state) => state.hackathons.nextHackathon
  )
  const { classes } = styles()

  return (
    <>
      <HeroHeader nextHackathon={nextHackathon} />

      <Container fluid mb={150} mt={20}>
        <Title align={'center'} mb={20} order={2}>
          Frequently Asked Questions
        </Title>
        <SimpleGrid cols={2} pt={20}>
          {qAndAList.map((qAndA, index) => (
            <Card
              withBorder
              shadow='sm'
              p='lg'
              key={index}
              className={classes.card}
            >
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
