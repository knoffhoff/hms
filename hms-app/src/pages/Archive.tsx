import React from 'react'
import ideaData from '../test/TestIdeaData'
import CategoryDropdown from '../components/CategoryDropdown'
import IdeaCardList from '../components/IdeaCardList'

function Archive() {
  return (
    <>
      <h1>this is the Archive</h1>
      <CategoryDropdown />
      <h2>Ideas List:</h2>
      <IdeaCardList ideas={ideaData}></IdeaCardList>
    </>
  )
}

export default Archive
