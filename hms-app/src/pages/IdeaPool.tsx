import {
  HackathonPreview,
  Idea,
  IdeaCardType,
  IdeaFormType,
  IdeaPreview,
} from '../common/types'
import IdeaCardList from '../components/lists/IdeaCardList'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Checkbox, Group, Modal, Title, Stack } from '@mantine/core'
import { getIdeaDetails, getIdeaList } from '../actions/IdeaActions'
import { useMsal } from '@azure/msal-react'
import { UserContext } from './Layout'
import { getListOfHackathons } from '../actions/HackathonActions'
import IdeaForm from '../components/input-forms/IdeaForm'
import { MIN_DATE } from '../common/constants'
import SearchBar from '../components/searchBar'
import { JOIN_BUTTON_COLOR } from '../common/colors'
import CategorySelector from '../components/CategorySelector'
import SkillSelector from '../components/SkillSelector'
import HackathonHeader from '../components/HackathonHeader'

function IdeaPool() {
  const { instance } = useMsal()
  const user = useContext(UserContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [allIdeaPreviews, setAllIdeaPreviews] = useState<IdeaPreview[]>([])
  const [ideaData, setIdeaData] = useState<Idea>()
  const [relevantIdeaList, setRelevantIdeaList] = useState<Idea[]>([])
  const [opened, setOpened] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [hackathon, setHackathon] = useState<HackathonPreview>(
    {} as HackathonPreview
  )
  const [userIdeaList, setUserIdeaList] = useState<Idea[]>([])
  const [showUserIdeas, setShowUserIdeas] = useState(false)

  const loadHackathons = () => {
    getListOfHackathons(instance).then((data) => {
      const upcomingHackathon = data.find(
        (hackathon) => hackathon.startDate < MIN_DATE
      )
      if (upcomingHackathon) {
        setHackathon(upcomingHackathon)
      }
    })
  }

  const loadHackathonIdeas = () => {
    if (hackathon.id !== undefined) {
      setRelevantIdeaList([])
      getIdeaList(instance, hackathon.id).then((data) => {
        setAllIdeaPreviews(data.ideas)
        setOpened(false)
      })
    }
  }

  const loadIdeaDetails = () => {
    if (allIdeaPreviews?.length > 0) {
      allIdeaPreviews.map((ideaPreview) => {
        getIdeaDetails(instance, ideaPreview.id).then((ideaDetails) => {
          setIdeaData(ideaDetails)
        })
      })
    }
  }

  const skillFilter = relevantIdeaList.filter((item) => {
    return selectedSkills.length === 0
      ? item
      : item.requiredSkills?.some((skill) => selectedSkills.includes(skill.id))
  })

  const categoryFilter = skillFilter.filter((item) => {
    return selectedCategory === undefined || selectedCategory.length === 0
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
    loadHackathons()
  }, [])

  useEffect(() => {
    loadHackathonIdeas()
  }, [hackathon])

  useEffect(() => {
    setUserIdeaList(userIdea)
  }, [showUserIdeas, searchTerm])

  useEffect(() => {
    loadIdeaDetails()
  }, [allIdeaPreviews])

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
      <HackathonHeader hackathonData={hackathon} />
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size={'70%'}
        title='Create New Idea!'
      >
        <IdeaForm
          ideaId={'null'}
          hackathon={hackathon}
          ownerId={user?.id}
          context={IdeaFormType.New}
          onSuccess={loadHackathonIdeas}
        />
      </Modal>

      {relevantIdeaList.length != null && (
        <>
          <Group position='apart' my={20}>
            <Stack align='flex-start' justify='flex-start' spacing='sm'>
              <Title order={2} mt={20}>
                {showUserIdeas
                  ? 'My submission: ' + userIdeaList.length
                  : 'Ideas submitted: ' + searchIdea.length}
              </Title>

              <Group>
                <Button
                  onClick={() => setOpened(true)}
                  style={{
                    backgroundColor: JOIN_BUTTON_COLOR,
                  }}
                >
                  New Idea
                </Button>
                <Checkbox
                  size='md'
                  label={'Show my ideas only'}
                  checked={showUserIdeas}
                  onChange={(event) =>
                    setShowUserIdeas(event.currentTarget.checked)
                  }
                />
              </Group>
            </Stack>
            {hackathon.id === undefined ? (
              'Category Loading'
            ) : (
              <Group position='right' mt={70}>
                <SkillSelector
                  hackathonId={hackathon.id}
                  onSelectedSkills={setSelectedSkills}
                />
                <CategorySelector
                  hackathonId={hackathon.id}
                  onSelectedCategory={setSelectedCategory}
                />
                <SearchBar onSearchTermChange={setSearchTerm} />
              </Group>
            )}
          </Group>

          <IdeaCardList
            ideas={showUserIdeas ? userIdeaList : searchIdea}
            columnSize={6}
            type={IdeaCardType.IdeaPortal}
            isLoading={false}
            onSuccess={loadHackathonIdeas}
          />
        </>
      )}
    </>
  )
}

export default IdeaPool
