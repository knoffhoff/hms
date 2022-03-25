import React, { useState } from 'react'
import IdeaCardSmall from '../components/IdeaCardSmall'
import ideaData from '../test/TestIdeaData'
import { SimpleGrid, Input, Group, Title } from '@mantine/core'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

function Voting() {
  const [searchedString, setSearchString] = useState('')

  const filteredIdeas = ideaData.filter((item) => {
    return item.title.includes(searchedString)
  })

  const [ideaOrder, setIdeaOrder] = useState(filteredIdeas)

  function handleOnDragEnd(result: any) {
    if (!result.destination) return

    const items = Array.from(ideaOrder)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setIdeaOrder(items)
  }

  function handleChange(event: any) {
    setSearchString(event.target.value)
  }

  const filteredIdeaList = ideaOrder.map((idea, index) => {
    const props = { ...idea, index }
    return (
      <Draggable key={idea.id} draggableId={idea.id.toString()} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <IdeaCardSmall {...props} />
          </div>
        )}
      </Draggable>
    )
  })

  const [votedIdea, setVotedIdea] = useState(filteredIdeas)
  const votingList = votedIdea.map((idea, index) => {
    const props = { ...idea, index }
    return (
      <Draggable key={idea.id} draggableId={idea.id.toString()} index={index}>
        {(provided) => <IdeaCardSmall {...idea} />}
      </Draggable>
    )
  })
  const columsList = {
    ['column-1']: {
      name: 'all ideas',
      items: filteredIdeaList,
    },
    ['column-2']: {
      name: 'voted ideas',
      items: [],
    },
  }
  const [columns, setColumns] = useState(columsList)
  //https://codesandbox.io/s/i0ex5?file=/src/App.js:1391-1718
  const onDragEnd2 = (result: any, columns: any, setColumns: any) => {
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

  return (
    <div>
      <Title order={1}>All ideas</Title>

      <Group position={'right'} py={20}>
        <Input
          variant="default"
          placeholder="Search..."
          onChange={handleChange}
        />
      </Group>

      <h2>below is the searched idea title</h2>
      <div
        style={{
          display: 'flex',
          border: '2px solid #00FFD0',
        }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd2(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: '2px solid #00FFD0',
                }}
                key={columnId}
              >
                <h2>{column.name}</h2>
                <div style={{ border: '2px solid #00FFD0' }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? 'lightblue'
                              : 'lightgrey',
                            padding: 4,
                            width: 250,
                            minHeight: 500,
                            border: '2px solid #00FFD0',
                          }}
                        >
                          {column.items.map((item: any, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
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
                                        padding: 16,
                                        margin: '0 0 8px 0',
                                        minHeight: '50px',
                                        backgroundColor: snapshot.isDragging
                                          ? '#263B4A'
                                          : '#456C86',
                                        color: 'white',
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {item.content}
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

      <h2>working 1 list version below</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="idealist">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ border: '2px solid #00FFD0' }}
            >
              <div
                className="idea-list"
                style={{
                  width: 340,
                  margin: 'auto',
                  border: '2px solid #00FFD0',
                }}
              >
                <h3>all ideas list</h3>
                <SimpleGrid cols={1} spacing={'lg'}>
                  {filteredIdeaList}
                </SimpleGrid>
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default Voting
