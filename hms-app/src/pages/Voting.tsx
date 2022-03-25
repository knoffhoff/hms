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
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="idealist">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ border: '2px solid #00FFD0' }}
            >
              <Draggable
                key={idea.id}
                draggableId={idea.id.toString()}
                index={index}
              >
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
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  })

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

      <div className="idea-list" style={{ width: 340, margin: 'auto' }}>
        <SimpleGrid cols={1} spacing={'lg'}>
          {filteredIdeaList}
        </SimpleGrid>
      </div>
    </div>
  )
}

export default Voting
