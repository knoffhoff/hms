import { Card, Stack, Text } from '@mantine/core'
import { styles } from '../../common/styles'
import { Idea } from '../../common/types'

type Props = {
  idea: Idea
}

export default function VoteList(props: Props) {
  const { idea } = props
  const { classes } = styles()

  return (
    <Card.Section className={classes.noBorderSection}>
      <Stack align={'center'} spacing={'xs'}>
        <Text className={classes.label}>Votes: </Text>
        <Text className={classes.text}>{idea.voters?.length}</Text>
      </Stack>
    </Card.Section>
  )
}
