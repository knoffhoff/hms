import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../actions/GetBackendData'
import HackathonDetails from '../components/HackathonDetails'
import { Select } from '@mantine/core'

interface HackathonPreview {
  id: string
  title: string
}

export default function Archive() {
  const [selectedHackweek, setSelectedHackweek] = useState('')
  const [hackathonList, setHackathonList] = useState({
    errorHackathonList: false,
    isLoadingHackathonList: true,
    hackathons: [] as HackathonPreview[],
  })

  const { errorHackathonList, isLoadingHackathonList, hackathons } =
    hackathonList

  const loadHackathons = () => {
    getListOfHackathons().then(
      (data) => {
        setHackathonList({
          ...hackathonList,
          hackathons: data.hackathons,
          errorHackathonList: false,
          isLoadingHackathonList: false,
        })
      },
      () => {
        setHackathonList({
          ...hackathonList,
          errorHackathonList: true,
          isLoadingHackathonList: false,
        })
      }
    )
  }

  const data = hackathonList.hackathons.map(
    (hackathon, index) => `${hackathon.id}`
  )

  const data2 = hackathonList.hackathons.map((hackathon, index) => [
    {
      value: hackathonList.hackathons[index].id,
      label: hackathonList.hackathons[index].title,
    },
  ])
  const data3 = hackathonList.hackathons.map((hackathon, index) => [
    {
      value: hackathon.id,
      label: hackathon.title,
    },
  ])

  const selectChange = (value: string) => {
    setSelectedHackweek(value)
  }

  useEffect(() => {
    loadHackathons()
  }, [])

  return (
    <>
      {isLoadingHackathonList && <div>hackathon select is loading...</div>}
      {!isLoadingHackathonList && (
        <div style={{ border: '1px solid red', width: 250 }}>
          <Select
            placeholder={'select a Hackathon'}
            maxDropdownHeight={280}
            data={data}
            onChange={selectChange}
          />
        </div>
      )}

      <h1>Selected Hackweek:</h1>
      <div style={{ border: '1px solid red' }}>
        <HackathonDetails hackathonID={selectedHackweek.toString()} />
      </div>
    </>
  )
}
