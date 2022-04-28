import React from 'react'
import { Idea } from '../common/types'
import { Grid } from '@mantine/core'
import IdeaCardFoldable from './IdeaCardFoldable'

type IProps = {
  ideas: Idea[]
  columnSize: number
  type: string
}

export default function IdeaCardList(props: IProps) {
  const { ideas, columnSize, type } = props

  const IdeasList = ideas.map((idea, index) => {
    return (
      <Grid.Col sm={columnSize} lg={columnSize}>
        <div style={{ padding: 10 }}>
          <IdeaCardFoldable idea={idea} type={type} />
        </div>
      </Grid.Col>
    )
  })

  return (
    <>
      <Grid gutter={'lg'} justify={'center'}>
        <Grid gutter={'lg'} style={{ minWidth: '100%' }}>
          {IdeasList}
        </Grid>
      </Grid>
    </>
  )
}
