import {
  Center,
  Container,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import React from 'react'
import { Hackathon } from '../common/types'
import { MAX_DATE } from '../common/constants'
import { RichTextEditor } from '@mantine/rte'
import { heroHeaderStyles } from '../common/styles'

type IProps = {
  hackathonData: Hackathon
}

export default function HackathonHeader(props: IProps) {
  const theme = useMantineColorScheme()
  const { hackathonData } = props
  const isHackathonWithoutDate = () =>
    new Date(hackathonData.startDate) > MAX_DATE
  const { classes } = heroHeaderStyles()

  const formatHackathonDates = () => {
    const startDate = hackathonData.startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    const endDate = hackathonData.endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    return `${startDate} - ${endDate}`
  }

  return (
    <div>
      <Container className={classes.wrapper} size={1400} style={{ marginBottom: '50px' }}>
        <Center>
          <Title className={classes.title} order={2} align={'center'}>
            {hackathonData.title}
          </Title>
        </Center>
        {hackathonData.startDate && hackathonData.endDate && (
          <Center>
            <div>
              {formatHackathonDates()}
            </div>
          </Center>
        )}
        {hackathonData.description && (
          <RichTextEditor
            readOnly
            value={hackathonData.description || ''}
            id='hackathonDescriptionEditor'
            style={{
              backgroundColor: 'transparent',
              border: 'none'
            }}
          />
        )}
      </Container>
    </div>
  )
}
