
import { useCallback, useState } from 'react'
import { Center, Container, Title, useMantineColorScheme, Accordion } from '@mantine/core'
import { Hackathon } from '../common/types'
import { MAX_DATE } from '../common/constants'
import { RichTextEditor } from '@mantine/rte'
import { heroHeaderStyles } from '../common/styles'
import { ChevronDown } from 'tabler-icons-react'

type IProps = {
  hackathonData: Hackathon
}

export default function HackathonHeader(props: IProps) {
  const theme = useMantineColorScheme()
  const { hackathonData } = props
  const isHackathonWithoutDate = () =>
    new Date(hackathonData.startDate) > MAX_DATE
  const { classes } = heroHeaderStyles()
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true)
  const handleAccordionChange = useCallback((value: string | null) => {
    setIsDescriptionOpen(value === 'hackathon-details')
  }, [])

  const formatHackathonDates = () => {
    const startDate = hackathonData.startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    const endDate = hackathonData.endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    return `${startDate} - ${endDate}`
  }

  return (
    <Container className={classes.wrapper} size={1400} style={{ marginBottom: '50px' }}>
      <div>
        <Title className={classes.title} order={2} align={'center'}>
          {hackathonData.title}
        </Title>
        {hackathonData.startDate && hackathonData.endDate && (
          <div style={{ textAlign: 'center' }}>
            {formatHackathonDates()}
          </div>
        )}
      </div>
      <Accordion defaultValue='hackathon-details' 
        onChange={handleAccordionChange} chevron={null}
        styles={{
          item: { border: 'none' }
        }}
      >
        <Accordion.Item value='hackathon-details'>
          <Accordion.Panel>
            {isDescriptionOpen && hackathonData.description && (
              <RichTextEditor
                readOnly
                value={hackathonData.description || ''}
                id='hackathonDescriptionEditor'
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  // marginBottom: '8px',
                }}
              />
            )}
          </Accordion.Panel>
          <Accordion.Control style={{ backgroundColor: 'transparent' }}>
            <Center>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <ChevronDown
                    size={24}
                    style={{
                      transition: 'transform 0.3s ease-in-out',
                      transform: isDescriptionOpen ? 'rotate(180deg)' : 'none',
                    }}
                  />
                </div>
              </div>
            </Center>
          </Accordion.Control>
        </Accordion.Item>
      </Accordion>
    </Container>
  )
}
