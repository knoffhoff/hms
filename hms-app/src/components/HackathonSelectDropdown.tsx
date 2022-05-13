import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import { Select } from '@mantine/core'
import { HackathonPreview } from '../common/types'

type Props = {
  setHackathonID: (hackthonID: string) => void
}

export default function HackathonSelectDropdown(setHackathonID: Props) {
  const [selectedHackweek, setSelectedHackweek] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonList, setHackathonList] = useState([] as HackathonPreview[])

  const loadHackathons = () => {
    getListOfHackathons().then(
      (data) => {
        setHackathonList(data.hackathons)
        setIsLoading(false)
        setIsError(false)
      },
      () => {
        setIsError(true)
        setIsLoading(false)
      }
    )
  }

  const hackathonMap = hackathonList.map((hackathon, index) => ({
    value: hackathon.id,
    label:
      hackathon.title +
      ' ' +
      new Date(hackathon.startDate).toLocaleDateString() +
      '-' +
      new Date(hackathon.endDate).toLocaleDateString(),
  }))

  const selectChange = (value: string) => {
    setSelectedHackweek(value)
  }

  useEffect(() => {
    loadHackathons()
  }, [])

  useEffect(() => {
    setHackathonID.setHackathonID(selectedHackweek)
  }, [selectedHackweek])

  /*setHackathonID.setHackathonID(selectedHackweek)*/

  return (
    <>
      {isLoading && !isError && <div>hackathon select is loading...</div>}
      {!isLoading && !isError && (
        <div style={{ width: 385 }}>
          <Select
            placeholder={'select a Hackathon'}
            maxDropdownHeight={280}
            data={hackathonMap}
            onChange={selectChange}
          />
        </div>
      )}
    </>
  )
}
