import React, { useEffect, useState } from 'react'
import ideaData from '../test/TestIdeaData'
import { Input, Group, Title } from '@mantine/core'
import { Search } from 'tabler-icons-react'
import IdeaCardList from '../components/IdeaCardList'
import HackathonDetails from '../components/HackathonDetails'
import { Hackathon, IdeaPreview } from '../common/types'
import { getHackathonDetails } from '../actions/GetBackendData'

function IdeaPortal() {
  const [searchTerm, setSearchTerm] = useState('')
  const hackathonID = '4eb2d486-c786-431e-a4fd-4c093ed30642'
  const [hackathonData, setHackathonData] = useState({
    errorHackathonData: false,
    isLoadingHackathonData: true,
    title: 'string',
    startDate: '',
    endDate: '',
    participants: null,
    categories: null,
    ideas: [] as IdeaPreview[],
  })

  const loadSelectedHackathon = () => {
    getHackathonDetails(hackathonID).then(
      (data) => {
        setHackathonData({
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          participants: data.participants,
          categories: data.categories,
          ideas: data.ideas,
          errorHackathonData: false,
          isLoadingHackathonData: false,
        })
      },
      () => {
        setHackathonData({
          ...hackathonData,
          errorHackathonData: true,
          isLoadingHackathonData: false,
        })
      }
    )
  }
  useEffect(() => {
    loadSelectedHackathon()
  }, [])

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const filteredIdeas = hackathonData.ideas.filter((item) => {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <>
      <Title order={1}>All ideas</Title>
      <Group position={'right'} py={20}>
        <Input
          variant="default"
          placeholder="Search for idea title..."
          icon={<Search />}
          onChange={handleChangeSearch}
        />
      </Group>

      {hackathonData.errorHackathonData && (
        <div>
          <h3>Error loading hackathons</h3>
          <p>something went wrong.</p>
        </div>
      )}
      {hackathonData.isLoadingHackathonData && (
        <div>
          <h3>Hackathon details are loading...</h3>
        </div>
      )}

      {!hackathonData.isLoadingHackathonData && (
        <div>
          <h2>{hackathonData.title}</h2>
          <h2>
            from: {new Date(hackathonData.startDate).toDateString()} to:{' '}
            {new Date(hackathonData.endDate).toDateString()}
          </h2>

          <div style={{ border: '1px solid red' }}>
            <IdeaCardList
              ideaPreviews={filteredIdeas}
              columnSize={6}
              type={'idea-portal'}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default IdeaPortal
