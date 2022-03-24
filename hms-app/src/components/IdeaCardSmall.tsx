import React from 'react'
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
      <Group align={'center'} position={'right'}>
        {/*TODO: check for like*/}
        <ActionIcon variant="hover" color={false ? 'yellow' : 'gray'}>
          {/*TODO: check for like*/}
          {false ? (
            <span className="material-icons">star</span>
          ) : (
            <span className="material-icons">star_outline</span>
          )}
        </ActionIcon>
      </Group>
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
      </Group>
    </Card>
  )
}

export default IdeaCardSmall
