import { Card, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { styles } from '../../common/styles'
import { Idea } from '../../common/types'

type Props = {
  idea: Idea
}

export default function VoteList(props: Props) {
  const { idea } = props
  const [ideaData, setIdeaData] = useState(idea)
  const { classes } = styles()

  return (
    <Card.Section className={classes.noBorderSection}>
      <Stack align={'center'} spacing={'xs'}>
        <Text className={classes.label}>Votes: </Text>
        <Text className={classes.text}>{ideaData.voters?.length}</Text>
      </Stack>
    </Card.Section>
  )
}
