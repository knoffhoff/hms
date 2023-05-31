import { Accordion, Button, Group, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Idea, IdeaCardType, IdeaPreview } from '../../common/types'
import { styles } from '../../common/styles'
import { useMsal } from '@azure/msal-react'
import IdeaDetails from '../card-details/IdeaDetails'
import { getIdeaDetails, getIdeaList } from '../../actions/IdeaActions'
import { Link } from 'react-router-dom'
import { PRIMARY_COLOR_2, JOIN_BUTTON_COLOR } from '../../common/colors'

type IProps = {
  hackathonID: string
}

function AllIdeaList(props: IProps) {
  const { instance } = useMsal()
  const { classes } = styles()
  const [isLoading, setIsLoading] = useState(true)
  const [allIdeaPreviews, setAllIdeaPreviews] = useState<IdeaPreview[]>([])
  const [relevantIdeaList, setRelevantIdeaList] = useState<Idea[]>([])
  const [ideaData, setIdeaData] = useState<Idea>()
  const { hackathonID } = props

  const loadIdeaList = () => {
    setRelevantIdeaList([])
    getIdeaList(instance, hackathonID).then((data) => {
      setIsLoading(false)
      setAllIdeaPreviews(data.ideas)
    })
  }

  const loadRelevantIdeaDetails = () => {
    if (allIdeaPreviews?.length > 0) {
      allIdeaPreviews.map((ideaPreview) => {
        getIdeaDetails(instance, ideaPreview.id).then((ideaDetails) => {
          setIdeaData(ideaDetails)
        })
      })
    }
  }

  useEffect(() => {
    loadIdeaList()
  }, [])

  useEffect(() => {
    loadRelevantIdeaDetails()
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

  const allIdeas = relevantIdeaList.map((idea, index) => (
    <Accordion.Item key={idea.id} value={idea.id}>
      <Accordion.Control>
        {index + 1}. {idea.title}
      </Accordion.Control>
      <Accordion.Panel>
        <IdeaDetails
          idea={idea}
          type={IdeaCardType.Admin}
          isLoading={isLoading}
          onSuccess={refreshList}
        />
      </Accordion.Panel>
    </Accordion.Item>
  ))

  function refreshList() {
    setIsLoading(true)
    loadIdeaList()
  }

  return (
    <>
      <Accordion chevronPosition={'left'}>
        <Accordion.Item value={'ideas'}>
          <Accordion.Control>
            <Text className={classes.label}>Ideas ( {allIdeas?.length} )</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Group position='left' mt='xl'>
              <Button
                style={{ backgroundColor: PRIMARY_COLOR_2 }}
                mb={20}
                onClick={() =>
                  localStorage.setItem(
                    'ideas',
                    JSON.stringify(relevantIdeaList)
                  )
                }
                component={Link}
                to='/pitch'
              >
                Pitch
              </Button>
              <Button
                style={{ backgroundColor: JOIN_BUTTON_COLOR }}
                mb={20}
                onClick={() =>
                  localStorage.setItem(
                    'ideas',
                    JSON.stringify(relevantIdeaList)
                  )
                }
                component={Link}
                to='/finals'
              >
                Final
              </Button>
            </Group>
            <Accordion chevronPosition={'right'}>{allIdeas}</Accordion>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default AllIdeaList
