import { Accordion, Button, Grid, Text } from '@mantine/core'
import ideaData from '../test/TestIdeaData'
import { Idea } from '../common/types'
import IdeaCardList from '../components/IdeaCardList'
import React from 'react'
import NewIdea from '../components/NewIdea'

function YourIdeas() {
  const ideas = ideaData as Idea[]

  return (
    <>
      <h1>this is the your idea page</h1>
      <Accordion mb={30} icon={false} iconPosition="right">
        <Accordion.Item
          label={
            <Button radius="md" size="md">
              Create new idea
            </Button>
          }
        >
          <NewIdea />
        </Accordion.Item>
      </Accordion>

      <IdeaCardList ideas={ideas} columnSize={6}></IdeaCardList>
    </>
  )
}

export default YourIdeas
