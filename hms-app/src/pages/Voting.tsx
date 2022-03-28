import React, { useCallback, useReducer, useState } from 'react'
import IdeaCardSmall from '../components/IdeaCardSmall'
import ideaData from '../test/TestIdeaData'
import { SimpleGrid, Input, Group, Title } from '@mantine/core'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import produce from 'immer'

function Voting() {
  const [searchedString, setSearchString] = useState('')

  const filteredIdeas = ideaData.filter((item) => {
    return item.title.includes(searchedString)
  })
  function handleSearchChange(event: any) {
    setSearchString(event.target.value)
  }

  const [ideaOrder, setIdeaOrder] = useState(filteredIdeas)
  const [votingOrder, setVotingOrder] = useState([])

  // console.log('votingOrder')
  // console.log(votingOrder)

  function handleOnDragEnd(result: any) {
    if (!result.destination) return

    const items = Array.from(ideaOrder)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setIdeaOrder(items)

    // const votedItems = Array.from(votingOrder)
    // const [reorderedVotes] = votedItems.splice(result.source.index, 1)
    // votedItems.splice(result.destination.index, 0, reorderedVotes)
    // @ts-ignore
    setVotingOrder((votingOrder) => [...votingOrder, reorderedItem])

    console.log('reorderedItem')
    console.log(reorderedItem)
    console.log('items')
    console.log(items)

    // setVotingOrder(votedItems)

    console.log('votingOrder')
    console.log(votingOrder)
  }
  console.log('votingOrder')
  console.log(votingOrder)

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
  const votedIdeaList = votingOrder.map((idea: any, index) => {
    const props = { ...idea, index }
    return (
      <Draggable key={idea.id} draggableId={idea.id.toString()} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <IdeaCardSmall {...props} />
          </div>
        )}
      </Draggable>
    )
  })

  function submitVote() {
    console.log('voting submit is: ')
    console.log(votingOrder)
  }

  return (
    <div>
      <Title order={1}>All ideas</Title>

      <Group position={'right'} py={20}>
        <Input
          variant="default"
          placeholder="Search..."
          onChange={handleSearchChange}
        />
      </Group>

      <h2>below is the test version</h2>
      <div
        style={{
          display: 'flex',
          border: '2px solid #00FFD0',
        }}
      >
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="idealist" type="IDEA">
            {(provided) => {
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    width: 340,
                    margin: 'auto',
                    border: '2px solid #00FFD0',
                  }}
                >
                  {filteredIdeaList}
                  {provided.placeholder}
                </div>
              )
            }}
          </Droppable>
          <button onClick={submitVote}> submit vote</button>
          <Droppable droppableId="votinglist" type="IDEA">
            {(provided) => {
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    width: 340,
                    minHeight: 500,
                    margin: 'auto',
                    border: '2px solid #00FFD0',
                  }}
                >
                  {votedIdeaList}
                  {provided.placeholder}
                </div>
              )
            }}
          </Droppable>
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
