import React, { useState } from 'react'
import {
  Button,
  Title,
  useMantineTheme,
  Text,
  Grid,
  createStyles,
} from '@mantine/core'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import ideaData from '../test/TestIdeaData'
import IdeaCardFoldable from '../components/IdeaCardFoldable'

const useStyles = createStyles((theme, _params, getRef) => ({
  list: {
    height: 750,
    borderRadius: 15,
    overflowY: 'scroll',
    scrollbarWidth: 'none',
    border: '10px solid',
    borderColor:
      theme.colorScheme === 'dark'
        ? theme.colors.gray[7]
        : theme.colors.dark[1],
  },
  cards: {
    marginBottom: '10px',
    marginTop: '5px',
  },
}))

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
  const { classes } = useStyles()
  const theme = useMantineTheme()

  const backgroundColor =
    theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.dark[1]

  function submitVote() {
    console.log('voting submit is: ')
    console.log(columns['2'].items)
  }

  return (
    <div>
      <Grid>
        <Grid.Col span={12}>
          <Title pl={'sm'}>and the winner is...</Title>
        </Grid.Col>
        <Grid.Col span={12}>
          <Text size="lg" weight={600} pl={'sm'}>
            Welcome! here you will be able to vote for your favorite ideas
          </Text>
        </Grid.Col>
        <Grid.Col span={11}>
          <Text size="md" pl={'sm'}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet.
          </Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Button color={'green'} size={'lg'} ml={'sm'} onClick={submitVote}>
            Submit vote
          </Button>
        </Grid.Col>

        <Grid.Col span={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <DragDropContext
              onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
            >
              <Grid.Col span={4}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div>
                    <Title order={2} align={'center'}>
                      {columns['1'].name}
                    </Title>
                    <Droppable droppableId={'1'} key={'1'}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={classes.list}
                          typeof={'list'}
                          style={{
                            background: snapshot.isDraggingOver
                              ? 'grey'
                              : backgroundColor,
                          }}
                        >
                          {columns['1'].items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={classes.cards}
                                  >
                                    <IdeaCardFoldable
                                      idea={item}
                                      index={index}
                                      type={'voting'}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </Grid.Col>

              <Grid.Col span={2}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    fontSize: '500%',
                    paddingTop: 75,
                    height: 750,
                  }}
                >
                  <div>1.</div>
                  <div>2.</div>
                  <div>3.</div>
                </div>
              </Grid.Col>

              <Grid.Col span={4}>
                <div>
                  <Title order={2} align={'center'}>
                    {columns['2'].name}
                  </Title>
                  <Droppable
                    droppableId={'2'}
                    key={'2'}
                    isDropDisabled={columns['2'].items.length > 2}
                  >
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={classes.list}
                        style={{
                          background: snapshot.isDraggingOver
                            ? 'grey'
                            : backgroundColor,
                        }}
                      >
                        {columns['2'].items.map((item, index) => {
                          return (
                            <Draggable
                              // @ts-ignore
                              key={item.id}
                              // @ts-ignore
                              draggableId={item.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={classes.cards}
                                >
                                  <IdeaCardFoldable
                                    idea={item}
                                    index={index}
                                    type={'voting'}
                                  />
                                </div>
                              )}
                            </Draggable>
                          )
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </Grid.Col>
            </DragDropContext>
          </div>
        </Grid.Col>
      </Grid>
    </div>
  )
}
