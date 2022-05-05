import React, { useState } from 'react'
import { Button, Title, useMantineTheme, Text, Group } from '@mantine/core'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import ideaData from '../test/TestIdeaData'
import IdeaDetails from '../components/card- details/IdeaDetails'

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

const onDragStart = (result: any, columns: any, setCanVote: any) => {
  if (columns['2'].items.length === 3 && result.source.droppableId === '1')
    setCanVote(false)
  else setCanVote(true)
}

export default function Voting() {
  const [columns, setColumns] = useState(columnsFromBackend)
  const [canVote, setCanVote] = useState(true)

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
          onDragStart={(result) => onDragStart(result, columns, setCanVote)}
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
                            fontSize: '5rem',
                            marginLeft: '100px',
                            marginRight: '10px',
                          }
                    }
                  >
                    <div>1.</div>
                    <div>2.</div>
                    <div>3.</div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <Title order={2}>{column.name}</Title>
                    <Droppable
                      droppableId={columnId}
                      key={columnId}
                      isDropDisabled={!canVote && columnId !== '1'}
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
                              height: 680,
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
                                        {/*<IdeaDetails
                                          ideaPreview={item}
                                          index={index}
                                          type={'voting'}
                                        />*/}
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
              </div>
            )
          })}
        </DragDropContext>
      </div>
    </div>
  )
}
