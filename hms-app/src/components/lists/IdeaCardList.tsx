import React from 'react'
import { Idea, IdeaCardType } from '../../common/types'
import { Grid } from '@mantine/core'
import IdeaDetails from '../card-details/IdeaDetails'

type IProps = {
  ideas: Idea[]
  isLoading: boolean
  columnSize: number
  type: IdeaCardType
  reloadIdeaList?: () => void
}

export default function IdeaCardList(props: IProps) {
  const { ideas, columnSize, type, isLoading, reloadIdeaList } = props

  const IdeasList = ideas.map((idea, index) => {
    return (
      <Grid.Col key={index} sm={columnSize} lg={columnSize}>
        <div style={{ padding: 10 }}>
          <IdeaDetails
            idea={idea}
            type={type}
            isLoading={isLoading}
            onSuccess={reloadIdeaList}
          />
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
