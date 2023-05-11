import { useMsal } from '@azure/msal-react'
import { Card, Stack, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { getIdeaDetails } from '../../actions/IdeaActions'
import { styles } from '../../common/styles'
import { Idea } from '../../common/types'

type IProps = {
  idea: Idea
  reloadIdeaList?: () => void
}

export default function VoteList(props: IProps) {
  const { instance } = useMsal()
  const { idea } = props
  const { classes } = styles()
  const [loader, setLoader] = useState(false)
  const [ideaData, setIdeaData] = useState(idea)

  const loadIdeaData = () => {
    getIdeaDetails(instance, ideaData.id).then((data) => {
      setIdeaData(data)
      setLoader(false)
    })
  }

  function refreshList() {
    setLoader(true)
    loadIdeaData()
  }

  useEffect(() => {
    loadIdeaData()
  }, [loader])

  return (
    <Card.Section className={classes.noBorderSection}>
      <Stack align={'center'} spacing={'xs'}>
        <Text className={classes.label}>Votes: </Text>
        <Text className={classes.text}>{idea.voters?.length}</Text>
      </Stack>
    </Card.Section>
  )
}
