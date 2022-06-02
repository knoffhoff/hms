import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Badge, Button, Card, Grid, Group, Text } from '@mantine/core'
import { useFullscreen } from '@mantine/hooks'
import { Idea, UserPreview } from '../common/types'
import Carousel from 'nuka-carousel'
import { styles } from '../common/styles'

export default function Presentations() {
  const { classes } = styles()
  const { ref, toggle, fullscreen } = useFullscreen()
  // @ts-ignore
  const allIdeas = JSON.parse(localStorage.getItem('ideas'))

  function renderName(user: UserPreview): string {
    return user.firstName + (user.lastName ? ' ' + user.lastName : '')
  }

  function getIdeasList() {
    return allIdeas.map((idea: Idea, index: number) => (
      <div style={{ padding: 10 }}>
        <Card
          withBorder
          radius="md"
          p="md"
          style={{ height: '99vh' }}
          className={classes.presentationsCards}
        >
          <Card.Section
            style={{ height: '6%' }}
            className={classes.noBorderSection}
          >
            <Text className={classes.label}>Title</Text>
            <Text mt="sm" style={{ backgroundColor: 'white' }}>
              {idea.title}
            </Text>
          </Card.Section>

          <Card.Section
            style={{ height: '25%' }}
            className={classes.noBorderSection}
          >
            <Grid align="center">
              <Grid.Col span={8}>
                <Card.Section style={{ height: '100%' }}>
                  <Text className={classes.label}>Description</Text>
                  <Text
                    mt="sm"
                    style={{
                      backgroundColor: 'white',
                      height: '20vh',
                    }}
                  >
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

          <Card.Section
            style={{ height: '20%' }}
            className={classes.noBorderSection}
          >
            <Text className={classes.label}>Problem</Text>
            <Text
              mt="sm"
              style={{
                backgroundColor: 'white',
                height: '15vh',
              }}
            >
              {idea.problem}
            </Text>
          </Card.Section>

          <Card.Section
            style={{ height: '20%' }}
            className={classes.noBorderSection}
          >
            <Text className={classes.label}>Goal</Text>
            <Text mt="sm" style={{ backgroundColor: 'white', height: '15vh' }}>
              {idea.goal}
            </Text>
          </Card.Section>

          <Card.Section
            style={{ height: '20%' }}
            className={classes.noBorderSection}
          >
            <Grid>
              <Grid.Col span={6}>
                <Card.Section>
                  <Text className={classes.label}>Skills</Text>
                  <Text
                    mt="sm"
                    style={{
                      backgroundColor: 'white',
                      height: '15vh',
                    }}
                  >
                    <ul>
                      {idea.requiredSkills?.map((skill, index) => (
                        <li key={skill.id}>{skill.name}</li>
                      ))}
                    </ul>
                  </Text>
                </Card.Section>
              </Grid.Col>

              <Grid.Col span={6}>
                <Card.Section>
                  <Text className={classes.label}>Participants</Text>
                  <Text
                    mt="sm"
                    style={{
                      backgroundColor: 'white',
                      height: '15vh',
                    }}
                  >
                    <Grid>
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
                            {renderName(participant.user)}
                          </div>
                        </Grid.Col>
                      ))}
                    </Grid>
                  </Text>
                </Card.Section>
              </Grid.Col>
            </Grid>
          </Card.Section>
        </Card>
      </div>
    ))
  }

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

      <div ref={ref}>
        <Carousel enableKeyboardControls={true}>{getIdeasList()}</Carousel>
      </div>
    </>
  )
}
