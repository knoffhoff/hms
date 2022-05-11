import React, { useEffect, useState } from 'react'
import { Input, Group, Title, Button } from '@mantine/core'
import { Search } from 'tabler-icons-react'
import IdeaCardList from '../components/lists/IdeaCardList'
import { Hackathon, Idea } from '../common/types'
import {
  createParticipant,
  deleteParticipant,
} from '../actions/ParticipantActions'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'
import { showNotification, updateNotification } from '@mantine/notifications'
import { CheckIcon } from '@modulz/radix-icons'

function IdeaPortal() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHackweek, setSelectedHackweek] = useState('')
  const [relevantIdeaList, setRelevantIdeas] = useState([] as Idea[])
  const [participantInfo, setParticipantInfo] = useState({
    userId: 'f6fa2b8e-68ed-4486-b8df-f93b87ff23e5',
    hackathonId: '',
    participantId: '',
  })
  const [hackathonData, setHackathons] = useState({
    id: 'string',
    title: 'string',
    startDate: new Date(),
    endDate: new Date(),
    participants: [],
    categories: undefined,
    ideas: [],
  } as Hackathon)

  useEffect(() => {
    setParticipantInfo({ ...participantInfo, hackathonId: selectedHackweek })
  }, [selectedHackweek])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredIdeas = relevantIdeaList.filter((item) => {
    return item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const hackathonParticipants = hackathonData.participants?.map(
    (participant) => participant.user.id
  )

  const filterParticipants = hackathonData.participants?.filter((item) => {
    return item.user.id.includes(participantInfo.userId)
  })

  const addHackathonParticipant = () => {
    showNotification({
      id: 'participant-load',
      loading: true,
      title: 'Join Hackathon',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })
    createParticipant(participantInfo.userId, participantInfo.hackathonId).then(
      (r) => {
        setTimeout(() => {
          console.log('r', r)
          updateNotification({
            id: 'participant-load',
            color: 'teal',
            title: 'Joined Hackathon',
            message: 'Notification will close in 2 seconds',
            icon: <CheckIcon />,
            autoClose: 2000,
          })
        }, 3000)
        setParticipantInfo((prevState) => ({
          ...prevState,
          participantId: r.id,
        }))
      }
    )
  }

  const removeHackathonParticipant = () => {
    showNotification({
      id: 'participant-load',
      loading: true,
      title: 'Left Hackathon',
      message: 'this can take a second',
      autoClose: false,
      disallowClose: true,
    })
    // @ts-ignore
    deleteParticipant(filterParticipants[0].id).then((r) => {
      setTimeout(() => {
        console.log('r', r)
        updateNotification({
          id: 'participant-load',
          color: 'teal',
          title: 'Left Hackathon',
          message: 'Notification will close in 2 seconds',
          icon: <CheckIcon />,
          autoClose: 2000,
        })
      }, 3000)
    })
  }

  const setHackathonID = (hackthonID: string) => {
    setSelectedHackweek(hackthonID)
  }

  const setRelevantIdeaList = (relevantIdeaList: Idea[]) => {
    setRelevantIdeas(relevantIdeaList)
  }

  const setHackathonData = (hackathonData: Hackathon) => {
    setHackathons(hackathonData)
  }

  const setThisIsLoading = (isLoading: boolean) => {
    setIsLoading(isLoading)
  }

  return (
    <>
      <Title order={1}>All ideas</Title>
      <Group position={'apart'} py={20}>
        <HackathonSelectDropdown setHackathonID={setHackathonID} />

        <Input
          variant="default"
          placeholder="Search for idea title..."
          icon={<Search />}
          onChange={handleChangeSearch}
        />
      </Group>

      <RelevantIdeasLoader
        setHackathon={setHackathonData}
        setRelevantIdea={setRelevantIdeaList}
        selectedHackweek={selectedHackweek}
        setLoading={setThisIsLoading}
      />

      {!isLoading && !hackathonParticipants?.includes(participantInfo.userId) && (
        <div>
          <Button onClick={() => addHackathonParticipant()}>
            Join Hackathon
          </Button>
        </div>
      )}
      {!isLoading && hackathonParticipants?.includes(participantInfo.userId) && (
        <div>
          <Button onClick={removeHackathonParticipant} color={'red'}>
            Left Hackathon
          </Button>
        </div>
      )}

      {!isLoading && (
        <div>
          <h2>{hackathonData.title}</h2>
          <h2>
            from: {new Date(hackathonData.startDate).toDateString()} to:{' '}
            {new Date(hackathonData.endDate).toDateString()}
          </h2>
          <h2>Your Ideas ({filteredIdeas.length})</h2>

          <div>
            <IdeaCardList
              ideas={filteredIdeas}
              columnSize={6}
              type={'idea-portal'}
              isLoading={false}
            />
          </div>
        </div>
      )}

      {isLoading && selectedHackweek && <div>Loading...</div>}
    </>
  )
}

export default IdeaPortal
