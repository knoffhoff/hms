import React, { useState } from 'react'
import { Button, Title, useMantineTheme, Text, Group } from '@mantine/core'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import ideaData from '../test/TestIdeaData'
import IdeaCardFoldable from '../components/IdeaCardFoldable'

const columnsFromBackend = {
  ['1']: {
    name: 'All ideas',
    items: [...ideaData],
  },
  ['2']: {
    name: 'Your Votes',
    items: [],
  },
}

const onDragEnd = (result: any, columns: any, setColumns: any) => {
  if (!result.destination) return
  const { source, destination } = result

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceItems = [...sourceColumn.items]
    const destItems = [...destColumn.items]
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    })
  } else {
    const column = columns[source.droppableId]
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    })
  }
}

export default function Voting() {
  const [columns, setColumns] = useState(columnsFromBackend)
  const theme = useMantineTheme()

  const backgroundColor =
    theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.dark[1]

  function submitVote() {
    console.log('voting submit is: ')
    console.log(columns['2'].items)
  }

  return (
    <div>
      <Group
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        <Title pl={'sm'}>and the winner is...</Title>

        <Text size="lg" weight={600} pl={'sm'}>
          Welcome! here you will be able to vote for your favorite ideas
        </Text>

        <Text size="md" pl={'sm'}>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet.
        </Text>

        <Button
          color={'green'}
          size={'lg'}
          ml={'sm'}
          onClick={submitVote}
          style={{ width: 175 }}
        >
          Submit vote
        </Button>
      </Group>

      <div
        style={{
          display: 'flex',
          paddingTop: '25px',
        }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                key={columnId}
              >
                <Title order={2}>{column.name}</Title>

                <div
                  style={{
                    margin: 8,
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <div
                    style={
                      columnId === '1'
                        ? { display: 'none' }
                        : {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'space-around',
                            fontSize: '500%',
                            paddingLeft: '100px',
                          }
                    }
                  >
                    <div
                      style={
                        columns['2'].items.length < 1
                          ? { visibility: 'hidden' }
                          : {}
                      }
                    >
                      1.
                    </div>
                    <div
                      style={
                        columns['2'].items.length < 2 ? { display: 'none' } : {}
                      }
                    >
                      2.
                    </div>
                    <div
                      style={
                        columns['2'].items.length < 3 ? { display: 'none' } : {}
                      }
                    >
                      3.
                    </div>
                  </div>
                  <Droppable
                    droppableId={columnId}
                    key={columnId}
                    isDropDisabled={
                      //ToDo find a way to allow cards being reordered if there are 3 cards in the voting list
                      columns['2'].items.length > 2 && columnId === '2'
                    }
                  >
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? 'grey'
                              : backgroundColor,
                            borderRadius: 10,
                            minHeight: 200,
                            maxHeight: 750,
                            width: 425,
                            overflowY: 'scroll',
                            scrollbarWidth: 'none',
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: 'none',
                                        margin: '10px',
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <IdeaCardFoldable
                                        idea={item}
                                        index={index}
                                        type={'voting'}
                                      />
                                    </div>
                                  )
                                }}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      )
                    }}
                  </Droppable>
                </div>
              </div>
            )
          })}
        </DragDropContext>
      </div>
    </div>
  )
}
