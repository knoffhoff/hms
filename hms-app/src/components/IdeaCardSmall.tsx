import React, { useState } from 'react'
import {
  Card,
  Text,
  Button,
  useMantineTheme,
  Group,
  ActionIcon,
  Modal,
} from '@mantine/core'
import ideaData from '../test/TestIdeaData'
import IdeaCardBig from './IdeaCardBig'
import { Idea } from '../common/types'

type IProps = {
  idea: Idea
  index: number
}

function IdeaCardSmall(props: IProps) {
  const [opened, setOpened] = useState(false)
  const [ideaDetailsClicked, setIdeaDetailsClicked] = useState(ideaData[0])
  const theme = useMantineTheme()
  const secondaryColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7]

  const { idea, index } = props

  function decreaseIdeaIndex() {
    if (ideaDetailsClicked.id > 0)
      setIdeaDetailsClicked(ideaData[ideaDetailsClicked.id - 1])
  }
  function increaseIdeaIndex() {
    //TODO change ideadata into index.length
    if (ideaDetailsClicked.id < ideaData.length - 1)
      setIdeaDetailsClicked(ideaData[ideaDetailsClicked.id + 1])
  }

  return (
    <>
      <Card shadow="sm" p="lg">
        <ActionIcon variant="light" color={'yellow'}>
          {/*TODO: check for like*/}
          {false ? (
            <span className="material-icons">star</span>
          ) : (
            <span className="material-icons">star_outline</span>
          )}
        </ActionIcon>
        <Text size={'xl'} weight={500}>
          {idea.title}
        </Text>

        <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
          {idea.description}
        </Text>

        <Group style={{ marginTop: 14 }}>
          <Modal
            centered
            withCloseButton={false}
            opened={opened}
            onClose={() => setOpened(false)}
          >
            <button onClick={decreaseIdeaIndex}>prev idea</button>
            <IdeaCardBig {...ideaDetailsClicked} />
            <button onClick={increaseIdeaIndex}>next idea</button>
          </Modal>
          <Button
            variant="filled"
            color="blue"
            onClick={() => {
              setOpened(true)
              setIdeaDetailsClicked(ideaData[index])
            }}
          >
            More information
          </Button>
        </Group>
      </Card>
    </>
  )
}

export default IdeaCardSmall
