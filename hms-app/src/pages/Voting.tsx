import {useEffect, useState} from 'react'
import {Button, Group, Text, Title, useMantineTheme} from '@mantine/core'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from 'react-beautiful-dnd'
import IdeaDetails from '../components/card-details/IdeaDetails'
import {useLocalStorage} from '../common/localStorage'
import {Idea, IdeaCardType} from '../common/types'

const onDragEnd = (result: DropResult, votingState: VotingState, setColumnsState: Function) => {
  if (!result.destination) return

  const { source, destination } = result

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn: TitledColumn = votingState[source.droppableId as keyof VotingState]
    const destinationColumn: TitledColumn = votingState[destination.droppableId as keyof VotingState]

    const sourceItems: Idea[] = [...sourceColumn.items]
    const destinationItems: Idea[] = [...destinationColumn.items]

    const [removed] = sourceItems.splice(source.index, 1)
    destinationItems.splice(destination.index, 0, removed)
    setColumnsState({
      ...votingState,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destinationColumn,
        items: destinationItems,
      },
    })
  } else {
    const sourceColumn: TitledColumn = votingState[source.droppableId as keyof VotingState]
    const copiedItems: Idea[] = sourceColumn.items
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    setColumnsState({
      ...votingState,
      [source.droppableId]: {
        ...sourceColumn,
        items: copiedItems,
      },
    })
  }
}

type TitledColumn = {
  name: string,
  items: Idea[],
}

type VotingState = {
  '1': TitledColumn,
  '2': TitledColumn;
}

const defaultColumnsFromBackend: VotingState = {
  '1': {
    name: 'All ideas',
    items: [],
  },
  '2': {
    name: 'Your Votes',
    items: [],
  }
}

export default function Voting() {
  const theme = useMantineTheme()
  const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.dark[1]

  const [votingState, setVotingState] = useLocalStorage("current-voting-state", defaultColumnsFromBackend)

  const [readyToVote, setReadyToVote] = useState(votingState[2].items.length === 3)
  useEffect(() => setReadyToVote(votingState[2].items.length === 3), [votingState]);

  const [dragEnabled, setDragEnabled] = useState(true);

  //TODO exchange it with real backend call
  function submitVote() {
    console.log(votingState['1'].items)
    console.log('voting submit is: ')
    console.log(votingState['2'].items)
  }

  const mapIdeaToDraggableIdea = (item: Idea, index: number) => {
    return <Draggable
      key={item.id}
      draggableId={item.id}
      index={index}
      isDragDisabled={!dragEnabled}
    >
      {(provided) => {
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
            <IdeaDetails
              idea={item}
              isLoading={false}
              type={IdeaCardType.Voting} />
          </div>
        )
      }}
    </Draggable>
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
        <Title pl={'sm'}>And the winner is...</Title>

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
          disabled={!readyToVote}
        >
          Submit vote
        </Button>
      </Group>

      <div style={{ display: 'flex', paddingTop: '25px' }}>
        <DragDropContext
          onDragStart={_ => {
            setDragEnabled(false)
            setReadyToVote(false)
          }}
          onDragEnd={result => {
            setDragEnabled(true)
            setReadyToVote(votingState[2].items.length === 3)
            onDragEnd(result, votingState, setVotingState)
          }}
        >
          {Object.entries(votingState)
            .map(([columnId, column]) => (
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
                    style={columnId === '1'
                      ? { display: 'none' }
                      : {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: 'space-around',
                        fontSize: '5rem',
                        marginLeft: '100px',
                        marginRight: '10px',
                      }}
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
                      isDropDisabled={readyToVote && columnId === '2'}
                    >
                      {(provided, snapshot) => (
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
                          {column.items.map(mapIdeaToDraggableIdea)}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </div>
              </div>
            ))}
        </DragDropContext>
      </div>
    </div>
  )
}
