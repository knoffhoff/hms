import React from 'react'
import IdeaCardSmall from './IdeaCardSmall'
import { Idea } from '../common/types'

type IProps = {
  ideas: Idea[]
}

export default function IdeaCardList(props: IProps) {
  const { ideas } = props

  return (
    <>
      {ideas.map((idea, index) => (
        <div style={{ padding: 10 }}>
          <IdeaCardSmall idea={idea} index={index} key={idea.id} />
        </div>
      ))}
    </>
  )
}
