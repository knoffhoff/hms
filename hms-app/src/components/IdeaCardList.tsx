import React from 'react'
import { Idea, IdeaPreviews } from '../common/types'
import { Grid } from '@mantine/core'
import IdeaCardFoldable from './IdeaCardFoldable'

type IProps = {
  ideaPreviews: IdeaPreviews[]
  columnSize: number
  type: string
}

export default function IdeaCardList(props: IProps) {
  const { ideaPreviews, columnSize, type } = props

  //ToDo ideapreviews = array aus ideaids (+title) => mit diesen ids ne request ans backend um details zu bekommen
  // details abspeichern und dann in IdeasList mappen

  const IdeasList = ideaPreviews.map((idea, index) => {
    return (
      <Grid.Col sm={columnSize} lg={columnSize}>
        <div style={{ padding: 10 }}>
          <IdeaCardFoldable
            ideaPreview={idea}
            index={index}
            key={idea.id}
            type={type}
          />
        </div>
      </Grid.Col>
    )
  })

  return (
    <>
      <Grid gutter={'lg'}>
        <Grid gutter={'lg'}>{IdeasList}</Grid>
      </Grid>
    </>
  )
}
