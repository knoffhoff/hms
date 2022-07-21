import { Text } from '@mantine/core'
import React from 'react'
import { styles } from '../common/styles'
import { Hackathon } from '../common/types'

type IProps = {
  hackathonData: Hackathon
}

export default function HackathonHeader(props: IProps) {
  const { classes } = styles()
  const { hackathonData } = props

  return (
    <div>
      <Text align={'center'} className={classes.title}>
        Title: {hackathonData.title}
      </Text>
      <Text align={'center'} className={classes.title}>
        Start date: {new Date(hackathonData.startDate).toLocaleDateString()}
      </Text>
      <Text align={'center'} className={classes.title}>
        End date: {new Date(hackathonData.endDate).toLocaleDateString()}
      </Text>
    </div>
  )
}
