import React from 'react'
import IdeaCardSmall from '../components/IdeaCardSmall'
import ideaData from '../test/TestIdeaData'
import CategoryDropdown from '../components/CategoryDropdown'
import { Grid } from '@mantine/core'

function IdeaPortal() {
  const IdeasList = ideaData.map((idea) => {
    return (
      <IdeaCardSmall
        {...idea} //spreads the item in its components in 1 line of code
      />
    )
  })

  return (
    <>
      <h1>this is the IdeaPortal</h1>
      <div>
        <h2>Ideas List:</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <p>Search for: </p>
          <input />
          <p>Sort by: </p>
          <input />
          <CategoryDropdown />
        </div>
      </div>
      <h3>chosen categorie is: </h3>
      <div className="idea-list">
        <Grid>
          <Grid.Col span={4}>1</Grid.Col>
          <Grid.Col span={4}>2</Grid.Col>
          <Grid.Col span={4}>3</Grid.Col>
        </Grid>
      </div>
    </>
  )
}

export default IdeaPortal
