import React, { useState } from 'react'
import HackathonDetails from '../components/card-details/HackathonDetails'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import { Title } from '@mantine/core'

export default function Archive() {
  const [selectedHackathonID, setSelectedHackathonID] = useState('')

  return (
    <>
      <Title order={1}>Archive</Title>
      <HackathonSelectDropdown
        setHackathonID={setSelectedHackathonID}
        context={'archive'}
      />

      <div>
        <HackathonDetails
          hackathonID={selectedHackathonID.toString()}
          type={'header'}
        />
      </div>
    </>
  )
}
