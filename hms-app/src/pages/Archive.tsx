import React from 'react'
import ideaData from '../test/TestIdeaData'
import IdeaCardList from '../components/IdeaCardList'
import { Idea } from '../common/types'

export default function Archive() {
  return (
    <>
      <h1>this is the Archive</h1>
      <h2>Ideas List:</h2>
      <IdeaCardList
        ideas={ideaData as Idea[]}
        columnSize={6}
        type={'archive'}
      />
    </>
  )
}
