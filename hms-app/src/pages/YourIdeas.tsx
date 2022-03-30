import { Accordion, Text } from '@mantine/core'
import ideaData from '../test/TestIdeaData'
import { Idea } from '../common/types'
import IdeaCardList from '../components/IdeaCardList'
import React from 'react'
import NewIdea from '../components/NewIdea'

function YourIdeas() {
  return (
    <>
      <h1>this is the your idea page</h1>
      <Accordion initialItem={1}>
        <Accordion.Item
          label={
            <Text size="lg" weight={500}>
              Create new idea
            </Text>
          }
        >
          <NewIdea />
        </Accordion.Item>
        <Accordion.Item
          label={
            <Text size="lg" weight={500}>
              Your ideas:
            </Text>
          }
        >
          <IdeaCardList ideas={ideaData as Idea[]}></IdeaCardList>
        </Accordion.Item>
      </Accordion>
      <IdeaCardList ideas={ideaData as Idea[]}></IdeaCardList>
    </>
  )
}

export default YourIdeas
