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
  const [hackathonList, setHackathonList] = useState({
    hackathons: [] as HackathonPreview[],
  })

  const loadHackathons = () => {
    getListOfHackathons().then(
      (data) => {
        setHackathonList({
          hackathons: data.hackathons,
        })
        setIsLoading(false)
        setIsError(false)
      },
      () => {
        setIsError(true)
        setIsLoading(false)
      }
    )
  }

  const hackathonMap = hackathonList.hackathons.map((hackathon, index) => ({
    value: hackathon.id,
    label: hackathon.title,
  }))

  const selectChange = (value: string) => {
    setSelectedHackweek(value)
  }

  useEffect(() => {
    loadHackathons()
  }, [])

  setHackathonID.setHackathonID(selectedHackweek)

  return (
    <>
      {isLoading && !isError && <div>hackathon select is loading...</div>}
      {!isLoading && !isError && (
        <div style={{ width: 250 }}>
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
