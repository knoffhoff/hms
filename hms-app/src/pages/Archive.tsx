import React, { useState } from 'react'
import HackathonDetails from '../components/card-details/HackathonDetails'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import { Title } from '@mantine/core'

export default function Archive() {
  const [selectedHackweekID, setSelectedHackweekID] = useState('')

  const setHackathonID = (hackthonID: string) => {
    setSelectedHackweekID(hackthonID)
  }

  return (
    <>
      <Title order={1}>Archive</Title>
      <HackathonSelectDropdown
        setHackathonID={setHackathonID}
        context={'archive'}
      />

      <div>
        <HackathonDetails
          hackathonID={selectedHackweekID.toString()}
          type={'header'}
        />
      </div>
    </>
  )
}
