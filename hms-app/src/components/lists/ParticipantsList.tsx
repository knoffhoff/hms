import { useEffect, useState } from 'react'
import { Accordion, Avatar, Group, Text } from '@mantine/core'
import { styles } from '../../common/styles'
import { getIdeaDetails } from '../../actions/IdeaActions'
import { useMsal } from '@azure/msal-react'
import { Idea } from '../../common/types'

type IProps = {
  idea: Idea
}

// Unused until refacoctoring of participants list
export default function ParticipantsList(props: IProps) {
  const { classes } = styles()
  const { instance } = useMsal()
  const { idea } = props
  const [ideaData, setIdeaData] = useState(idea)
  const [loader, setLoader] = useState(false)
  const [participantAccordionOpen, setParticipantAccordionOpen] =
    useState(false)

  const getInitials = (
    firstName: string | undefined,
    lastName: string | undefined
  ) => {
    if (firstName && lastName) {
      return `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`
    } else {
      return ''
    }
  }

  const loadIdeaData = () => {
    getIdeaDetails(instance, ideaData.id).then((data) => {
      setIdeaData(data)
      setLoader(false)
      console.log(participantData?.length)
    })
  }

  const participantData = ideaData.participants?.map(
    (participant, index) => (
      <div
        key={index}
        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <Avatar color='indigo' radius='xl' size='md'>
          {getInitials(participant.user.firstName, participant.user.lastName)}
        </Avatar>
        <Text className={classes.text}>
          {participant.user.firstName} {participant.user.lastName}
        </Text>
      </div>
    )
  )

  useEffect(() => {
    loadIdeaData()
  }, [loader])

  return (
    <Accordion
      chevronPosition={'right'}
      onChange={(value) =>
        setParticipantAccordionOpen(value === 'participants')
      }
    >
      <Accordion.Item value={'participants'}>
        <Accordion.Control>
          {!participantAccordionOpen ? (
            <div>
              <Text className={classes.label}>Current participants</Text>
              <Group spacing={7} mt={5}>
                <Avatar.Group>
                  {ideaData.participants?.map((participant, index) => (
                    <Avatar key={index} color='indigo' radius='xl' size='md'>
                      {getInitials(
                        participant.user.firstName,
                        participant.user.lastName
                      )}
                    </Avatar>
                  ))}
                </Avatar.Group>
              </Group>
            </div>
          ) : (
            <Text className={classes.label}>Current participants</Text>
          )}
        </Accordion.Control>
        <Accordion.Panel>{participantData}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}
