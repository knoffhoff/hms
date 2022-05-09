import React, { useState } from 'react'
import HackathonDetails from '../components/card-details/HackathonDetails'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'

export default function Archive() {
  const [selectedHackweek, setSelectedHackweek] = useState('')

  const getHackathonID = (hackthonID: string) => {
    setSelectedHackweek(hackthonID)
  }

  return (
    <>
      <HackathonSelectDropdown setHackathonID={getHackathonID} />

      <h1>Selected Hackweek:</h1>
      <div>
        <HackathonDetails
          hackathonID={selectedHackweek.toString()}
          type={'header'}
        />
      </div>
    </>
  )
}
