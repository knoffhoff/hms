import React, { useState } from 'react'
import HackathonDetails from '../components/card-details/HackathonDetails'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import { Group, Text, Title } from '@mantine/core'
import { HackathonDetailsType, HackathonDropdownMode } from '../common/types'
import { ArrowUp } from 'tabler-icons-react'

export default function Archive() {
  const [selectedHackathonId, setSelectedHackathonId] = useState('')

  return (
    <>
      <Group position={'apart'} my={20}>
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

      {selectedHackathonId !== '' && (
        <HackathonDetails
          hackathonId={selectedHackathonId}
          type={HackathonDetailsType.Archive}
        />
      )}
    </>
  )
}
