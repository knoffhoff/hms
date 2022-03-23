import React from 'react'
import { Heart } from 'tabler-icons-react'
import {
  Card,
  Text,
  Button,
  useMantineTheme,
  Group,
  ActionIcon,
} from '@mantine/core'

function IdeaCardSmall(idea: any) {
  const theme = useMantineTheme()

  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]

  return (
    <Card shadow="sm" p="lg">
      <Group
        position="apart"
        style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
      >
        <Text size={'xl'} weight={500}>
          {idea.title}
        </Text>
        <ActionIcon variant="light" color={'red'}>
          <Heart size={16} />
        </ActionIcon>
      </Group>

      <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
        {idea.description}
      </Text>

      <Group style={{ marginTop: 14 }}>
        <Button variant="filled" color="blue">
          More information
        </Button>
      </Group>
    </Card>
  )
}

export default IdeaCardSmall
