import React, { useState } from 'react'
import HackathonDetails from '../components/card-details/HackathonDetails'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import { Title } from '@mantine/core'

export default function Archive() {
  const [selectedHackathonId, setSelectedHackathonId] = useState('')

  return (
    <>
      <Title order={1}>Archive</Title>
      <HackathonSelectDropdown
        setHackathonId={setSelectedHackathonId}
        context={'archive'}
      />

      <div>
        <HackathonDetails
          hackathonId={selectedHackathonId.toString()}
          type={'header'}
        />
      </div>
    </>
  )
}
