import React from 'react'
import { Idea } from '../common/types'
import { Grid } from '@mantine/core'
import IdeaCardFoldable from './IdeaCardFoldable'

type IProps = {
  ideas: Idea[]
  columnSize: number
}

export default function IdeaCardList(props: IProps) {
  const { ideas, columnSize } = props

  const IdeasList = ideas.map((idea, index) => {
    return (
      <Grid.Col sm={columnSize} lg={columnSize}>
        <div style={{ padding: 10 }}>
          <IdeaCardFoldable idea={idea} index={index} key={idea.id} />
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
