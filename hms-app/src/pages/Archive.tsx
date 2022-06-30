import React, { useState } from 'react'
import HackathonDetails from '../components/card-details/HackathonDetails'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import { Title } from '@mantine/core'
import { HackathonDetailsType, HackathonDropdownMode } from '../common/types'

export default function Archive() {
  const [selectedHackathonId, setSelectedHackathonId] = useState('')

  return (
    <>
      <Title order={1}>Archive</Title>
      <HackathonSelectDropdown
        setHackathonId={setSelectedHackathonId}
        context={HackathonDropdownMode.Archive}
      />

      <div>
        <HackathonDetails
          hackathonId={selectedHackathonId}
          type={HackathonDetailsType.Archive}
        />
      </div>
    </>
  )
}
