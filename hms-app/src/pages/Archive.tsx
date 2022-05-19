import React, { useState } from 'react'
import HackathonDetails from '../components/card-details/HackathonDetails'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import { Title } from '@mantine/core'

enum Enum {
  Archive = 'ARCHIVE',
  Header = 'HEADER',
}

export default function Archive() {
  const [selectedHackathonId, setSelectedHackathonId] = useState('')

  return (
    <>
      <Title order={1}>Archive</Title>
      <HackathonSelectDropdown
        setHackathonId={setSelectedHackathonId}
        context={Enum.Archive}
      />

      <div>
        <HackathonDetails
          hackathonId={selectedHackathonId.toString()}
          type={Enum.Header}
        />
      </div>
    </>
  )
}
