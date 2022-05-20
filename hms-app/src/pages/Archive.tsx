import React, { useState } from 'react'
import HackathonDetails, {
  HackathonDetailsType,
} from '../components/card-details/HackathonDetails'
import HackathonSelectDropdown, {
  HackathonDropdownMode,
} from '../components/HackathonSelectDropdown'
import { Title } from '@mantine/core'

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
          type={HackathonDetailsType.Header}
        />
      </div>
    </>
  )
}
