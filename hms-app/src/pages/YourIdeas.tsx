import { Accordion, Button } from '@mantine/core'
import ideaData from '../test/TestIdeaData'
import { Idea } from '../common/types'
import IdeaCardList from '../components/IdeaCardList'
import React from 'react'
import NewIdea from '../components/NewIdea'

function YourIdeas() {
  return (
    <>
      <h1>this is the your idea page</h1>
      <Accordion mb={30} icon={false} iconPosition="right">
        <Accordion.Item
          style={{ border: 'none' }}
          label={
            <Button radius="md" size="md">
              Create new idea
            </Button>
          }
        >
          <NewIdea />
        </Accordion.Item>
      </Accordion>

      <IdeaCardList
        ideaPreviews={ideaData}
        columnSize={6}
        type={'your-ideas'}
      />
    </>
  )
}

export default YourIdeas
