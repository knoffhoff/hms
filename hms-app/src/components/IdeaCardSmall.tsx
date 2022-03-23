import React from 'react'
import { Heart } from 'tabler-icons-react'
import { Card, Text, Button, useMantineTheme, Group } from '@mantine/core'

function IdeaCardSmall(idea: any) {
  const theme = useMantineTheme()

  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]

  return (
    <Card shadow="sm" p="lg">
      <Text size={'xl'} weight={500}>
        {idea.title}
      </Text>

      <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
        {idea.description}
      </Text>

      <Group style={{ marginTop: 14 }}>
        <Button variant="filled" color="blue">
          More information
        </Button>
        <Button
          variant="light"
          color="gray"
          leftIcon={<Heart color={'#FA5252'} />}
        >
          Add to watchlist
        </Button>
      </Group>
    </Card>
  )
}

export default IdeaCardSmall
