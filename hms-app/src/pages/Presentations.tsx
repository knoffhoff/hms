import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Badge,
  Button,
  Card,
  createStyles,
  Grid,
  Group,
  Text,
} from '@mantine/core'
import { useForceUpdate, useFullscreen } from '@mantine/hooks'
import { Idea } from '../common/types'

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: 'lightblue',
  },
  section: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },
  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.xl,
    fontWeight: 700,
  },
}))

export default function Presentations() {
  const { classes } = useStyles()
  const { ref, toggle, fullscreen } = useFullscreen()
  const [count, setCount] = useState(0)
  // @ts-ignore
  const allIdeas = JSON.parse(localStorage.getItem('ideas'))
  const forceUpdate = useForceUpdate()
  let count2 = 6

  window.addEventListener(
    'keydown',
    function (event) {
      if (event.defaultPrevented) {
        return // Do nothing if the event was already processed
      }
      if (event.key === 'ArrowLeft') {
        console.log(count2)
        count2 = count2 - 1
        console.log(count2)
      } else if (event.key === 'ArrowRight') {
        console.log(count2)
        count2 = count2 + 1
        forceUpdate()
        console.log(count2)
      }
      // Cancel the default action to avoid it being handled twice
      event.preventDefault()
    },
    true
  )

  function getIdeasMap() {
    return allIdeas.map((idea: Idea, index: number) => (
      <div
        style={{ border: '1px solid', padding: 10 }}
        ref={index === count2 ? ref : null}
      >
        <Card
          withBorder
          radius="md"
          p="md"
          style={{ height: '100%' }}
          className={classes.card}
        >
          <Card.Section style={{ height: '5%' }} className={classes.section}>
            <Text mt="md" className={classes.label}>
              Title
            </Text>
            <Text mt="sm" style={{ backgroundColor: 'white' }}>
              {idea.title}
            </Text>
          </Card.Section>

          <Card.Section style={{ height: '25%' }} className={classes.section}>
            <Grid align="center">
              <Grid.Col span={8}>
                <Card.Section>
                  <Text mt="md" className={classes.label}>
                    Description
                  </Text>
                  <Text mt="sm" style={{ backgroundColor: 'white' }}>
                    {idea.description}
                  </Text>
                </Card.Section>
              </Grid.Col>
              <Grid.Col span={4}>
                <Card.Section>
                  <Group
                    direction={'column'}
                    align={'center'}
                    position={'center'}
                    spacing={'xs'}
                  >
                    <Avatar
                      color="indigo"
                      radius="xl"
                      size="xl"
                      src={
                        'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4'
                      }
                    />
                    <Badge size="md">
                      {idea.owner?.user.firstName} {idea.owner?.user.lastName}
                    </Badge>
                  </Group>
                </Card.Section>
              </Grid.Col>
            </Grid>
          </Card.Section>

          <Card.Section style={{ height: '20%' }} className={classes.section}>
            <Text mt="md" className={classes.label}>
              Problem
            </Text>
            <Text
              mt="sm"
              style={{
                backgroundColor: 'white',
                height: '70%',
              }}
            >
              {idea.problem}
            </Text>
          </Card.Section>

          <Card.Section style={{ height: '20%' }} className={classes.section}>
            <Text mt="md" className={classes.label}>
              Goal
            </Text>
            <Text mt="sm" style={{ backgroundColor: 'white', height: '70%' }}>
              {idea.goal}
            </Text>
          </Card.Section>

          <Card.Section style={{ height: '20%' }} className={classes.section}>
            <Grid>
              <Grid.Col span={6}>
                <Card.Section>
                  <Text mt="md" className={classes.label}>
                    Skills
                  </Text>
                  <Text
                    mt="sm"
                    style={{ backgroundColor: 'white', height: '70%' }}
                  >
                    <ul>
                      {idea.requiredSkills?.map((skill, index) => (
                        <li>{skill.name}</li>
                      ))}
                    </ul>
                  </Text>
                </Card.Section>
              </Grid.Col>
              <Grid.Col span={6}>
                <Card.Section>
                  <Text mt="md" className={classes.label}>
                    Participants
                  </Text>
                  <Grid style={{ backgroundColor: 'white', height: '70%' }}>
                    {idea.participants?.map((participant, index) => (
                      <Grid.Col span={4}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <Avatar
                            color="indigo"
                            radius="xl"
                            size="md"
                            src={
                              'https://avatars.githubusercontent.com/u/10353856?s=460&u=88394dfd67727327c1f7670a1764dc38a8a24831&v=4'
                            }
                          />
                          {participant.user.firstName}{' '}
                          {participant.user.lastName}
                        </div>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Card.Section>
              </Grid.Col>
            </Grid>
          </Card.Section>
        </Card>
      </div>
    ))
  }

  useEffect(() => {
    getIdeasMap()
  }, [count2])

  return (
    <>
      <Button component={Link} to="/admin">
        Back
      </Button>
      <Button onClick={toggle} color={fullscreen ? 'red' : 'blue'}>
        {fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      </Button>
      <h1>Fullscreen page for presentations</h1>
      <Button onClick={() => console.log(allIdeas)}>
        console log all ideas
      </Button>

      {getIdeasMap()}
    </>
  )
}
