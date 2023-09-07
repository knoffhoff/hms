import React from 'react'
import { Hackathon, Idea, IdeaCardType } from '../../common/types'
import { Grid } from '@mantine/core'
import IdeaDetails from '../card-details/IdeaDetails'

type IProps = {
  ideas: Idea[]
  isLoading: boolean
  columnSize: number
  type: IdeaCardType
  onSuccess?: () => void
  ishackathonStarted?: boolean
  hackathon: Hackathon
}

export default function IdeaCardList(props: IProps) {
  const {
    ideas,
    columnSize,
    type,
    isLoading,
    onSuccess,
    ishackathonStarted,
    hackathon,
  } = props

  const sortedIdeas = ideas.sort((a, b) => {
    return a.creationDate > b.creationDate ? -1 : 1
  })

  const IdeasList = sortedIdeas.map((idea, id) => {
    return (
      <Grid.Col key={idea.id} sm={columnSize} lg={columnSize}>
        <div style={{ padding: 10 }}>
          <IdeaDetails
            idea={idea}
            type={type}
            isLoading={isLoading}
            onSuccess={onSuccess}
            ishackathonStarted={ishackathonStarted}
            hackathon={hackathon}
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
