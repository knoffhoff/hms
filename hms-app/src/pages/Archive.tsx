import React, { useEffect, useState, useContext } from 'react'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import { Group, Text, Checkbox, Title, Stack } from '@mantine/core'
import {
  Hackathon,
  HackathonDropdownMode,
  Idea,
  IdeaCardType,
} from '../common/types'
import { ArrowUp } from 'tabler-icons-react'
import { getHackathonDetails } from '../actions/HackathonActions'
import { useMsal } from '@azure/msal-react'
import HackathonHeader from '../components/HackathonHeader'
import IdeaCardList from '../components/lists/IdeaCardList'
import { getIdeaDetails } from '../actions/IdeaActions'
import { UserContext } from './Layout'
import SearchBar from '../components/searchBar'
import CategorySelector from '../components/CategorySelector'
import SkillSelector from '../components/SkillSelector'
import { NULL_DATE } from '../common/constants'

export default function Archive() {
  const { instance } = useMsal()
  const user = useContext(UserContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [hackathonData, setHackathonData] = useState({} as Hackathon)
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [isIdeaLoading, setIsIdeaLoading] = useState(true)
  const [ideaData, setIdeaData] = useState<Idea>()
  const [relevantIdeaList, setRelevantIdeaList] = useState([] as Idea[])
  const [userIdeaList, setUserIdeaList] = useState<Idea[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [showUserIdeas, setShowUserIdeas] = useState(false)

  const loadSelectedHackathon = () => {
    getHackathonDetails(instance, selectedHackathonId).then((data) => {
      setHackathonData(data)
    })
  }

  const loadRelevantIdeaDetails = () => {
    hackathonData.ideas?.map((ideaPreviews) => {
      getIdeaDetails(instance, ideaPreviews.id).then((data) => {
        setIdeaData(data)
        setIsIdeaLoading(false)
      })
    })
  }

  const skillFilter = relevantIdeaList.filter((item) => {
    return selectedSkills.length === 0
      ? item
      : item.requiredSkills?.some((skill) =>
          selectedSkills.includes(skill.id)
        )
  })

  const categoryFilter = skillFilter.filter((item) => {
    return selectedCategory.length === 0
      ? item
      : selectedCategory.some((category) => item.category?.id === category)
  })

  const searchIdea = categoryFilter.filter((item) => {
    return item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const userIdea = searchIdea.filter((item) => {
    const userId = user?.id
    return item.owner?.id === userId
  })

  useEffect(() => {
    setRelevantIdeaList([])
    loadSelectedHackathon()
  }, [selectedHackathonId])

  useEffect(() => {
    setUserIdeaList(userIdea)
  }, [showUserIdeas, searchTerm])

  useEffect(() => {
    loadRelevantIdeaDetails()
  }, [hackathonData])

  useEffect(() => {
    if (ideaData)
      if (
        !relevantIdeaList
          .map((relevant) => {
            return relevant.id
          })
          .includes(ideaData.id)
      ) {
        setRelevantIdeaList((relevantIdeaList) => {
          return [...relevantIdeaList, ideaData]
        })
      }
  }, [ideaData])

  return (
    <>
      <HackathonHeader hackathonData={hackathonData} />
      <Group position={'apart'} mb={20}>
        <HackathonSelectDropdown
          setHackathonId={setSelectedHackathonId}
          context={HackathonDropdownMode.Archive}
        />
      </Group>

      {selectedHackathonId === '' && (
        <>
          <ArrowUp size={'70px'} />
          <Text size={'lg'}>Select a hackathon here</Text>
        </>
      )}

      {hackathonData.startDate !== undefined &&
        hackathonData.startDate !== NULL_DATE &&
        hackathonData.startDate.toString() !== 'Invalid Date' && (
          <>
            <Group position={'apart'} my={20}>
              <Stack align='flex-start' justify='flex-start' spacing='sm'>
                <Title order={2} mt={50}>
                  {showUserIdeas
                    ? 'My Submissions: ' + userIdeaList.length
                    : 'Ideas submitted: ' + searchIdea.length}
                </Title>

                <Checkbox
                  mb={15}
                  size='md'
                  label={'Show my ideas only'}
                  checked={showUserIdeas}
                  onChange={(event) =>
                    setShowUserIdeas(event.currentTarget.checked)
                  }
                />
              </Stack>
              <Group position='right' mt={100}>
                <SkillSelector
                  hackathonId={selectedHackathonId}
                  onSelectedSkills={setSelectedSkills}
                />
                <CategorySelector
                  hackathonId={selectedHackathonId}
                  onSelectedCategory={setSelectedCategory}
                />
                <SearchBar onSearchTermChange={setSearchTerm} />
              </Group>
            </Group>
            <IdeaCardList
              ideas={showUserIdeas ? userIdeaList : searchIdea}
              columnSize={6}
              type={IdeaCardType.Archive}
              isLoading={isIdeaLoading}
              onSuccess={loadSelectedHackathon}
            />
          </>
        )}
    </>
  )
}
