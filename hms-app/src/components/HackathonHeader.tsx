import { useState } from 'react'
import { Center, Container, Title, Accordion } from '@mantine/core'
import { Hackathon, HackathonPreview } from '../common/types'
import { MAX_DATE, MIN_DATE, NULL_DATE } from '../common/constants'
import { RichTextEditor } from '@mantine/rte'
import { heroHeaderStyles } from '../common/styles'
import { ChevronDown } from 'tabler-icons-react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setHackathonHeaderOpened } from '../common/redux/hackathonSlice'

type IProps = {
  hackathonData: Hackathon | HackathonPreview
}

export default function HackathonHeader(props: IProps) {
  const { hackathonData } = props
  const { classes } = heroHeaderStyles()
  const [isDescriptionOpen, setIsDescriptionOpen] = useState<string | null>(
    'hackathon-details'
  )
  const dispatch = useAppDispatch()
  const hackathonHeaderOpened = useAppSelector(
    (state) => state.hackathons.hackathonHeaderOpened
  )

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

  function hackathonWithDate() {
    return (
      hackathonData.startDate > MIN_DATE && hackathonData.endDate < MAX_DATE
    )
  }

  function validHackathon() {
    return (
      hackathonData.startDate !== undefined &&
      hackathonData.startDate !== NULL_DATE &&
      hackathonData.startDate.toString() !== 'Invalid Date'
    )
  }

  const handleAccordionChange = (value: string | null) => {
    if (!hackathonHeaderOpened) {
      setIsDescriptionOpen(value)
      dispatch(setHackathonHeaderOpened(true))
    } else {
      setIsDescriptionOpen(null)
      dispatch(setHackathonHeaderOpened(false))
    }
  }

  return (
    <>
      {validHackathon() ? (
        <Container
          className={classes.wrapper}
          size={1400}
          style={{ marginBottom: '50px' }}
        >
          <div>
            <Title className={classes.title} order={2} align={'center'}>
              {hackathonData.title}
            </Title>
            {hackathonWithDate() && (
              <div style={{ textAlign: 'center' }}>
                {formatHackathonDates()}
              </div>
            )}
          </div>
          <Accordion
            value={hackathonHeaderOpened ? 'hackathon-details' : null}
            onChange={handleAccordionChange}
            chevron={null}
            styles={{
              item: { border: 'none' },
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
                          transform: hackathonHeaderOpened
                            ? 'rotate(180deg)'
                            : 'none',
                        }}
                      />
                    </div>
                  </div>
                </Center>
              </Accordion.Control>
            </Accordion.Item>
          </Accordion>
        </Container>
      ) : null}
    </>
  )
}
