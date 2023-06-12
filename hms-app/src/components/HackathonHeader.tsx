import {
  Badge,
  Center,
  Container,
  Title,
  useMantineColorScheme,
} from '@mantine/core'
import React from 'react'
import { Hackathon } from '../common/types'
import { MAX_DATE } from '../common/constants'
import { RichTextEditor } from '@mantine/rte'

type IProps = {
  hackathonData: Hackathon
}

export default function HackathonHeader(props: IProps) {
  const theme = useMantineColorScheme()
  const { hackathonData } = props
  const isHackathonWithoutDate = () =>
    new Date(hackathonData.startDate) > MAX_DATE

  return (
    <Container my={30}>
      <div>
        <Center>
          <Title>{hackathonData.title}</Title>
        </Center>
        {hackathonData.description && (
          <Center>
            <RichTextEditor
              readOnly
              value={hackathonData.description || ''}
              id='hackathonDescriptionEditor'
            />
          </Center>
        )}
      </div>
    </Container>
  )
}
