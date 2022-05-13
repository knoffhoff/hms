import React, { useState } from 'react'
import HackathonDetails from '../components/card-details/HackathonDetails'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'
import { Title } from '@mantine/core'

export default function Archive() {
  const [selectedHackweek, setSelectedHackweek] = useState('')

  const setHackathonID = (hackthonID: string) => {
    setSelectedHackweek(hackthonID)
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
          hackathonID={selectedHackweek.toString()}
          type={'header'}
        />
      </div>
    </>
  )
}
