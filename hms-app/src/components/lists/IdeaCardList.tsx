import React from 'react'
import { Idea } from '../../common/types'
import { Grid } from '@mantine/core'
import IdeaDetails, { IdeaDetailsCaller } from '../card-details/IdeaDetails'

type IProps = {
  ideas: Idea[]
  isLoading: boolean
  columnSize: number
  type: IdeaDetailsCaller
}

export default function IdeaCardList(props: IProps) {
  const { ideas, columnSize, type, isLoading } = props

  const IdeasList = ideas.map((idea, index) => {
    return (
      <Grid.Col key={index} sm={columnSize} lg={columnSize}>
        <div style={{ padding: 10 }}>
          <IdeaDetails idea={idea} type={type} isLoading={isLoading} />
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
