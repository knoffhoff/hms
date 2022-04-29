import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import NewHackathonDetails from '../components/hackathon-details/NewHackathonDetails'
import { Select } from '@mantine/core'
import { HackathonPreview } from '../common/types'

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
    (hackathon, index) => hackathon.title
  )

  const selectChange = (value: string) => {
    const getHackathon = hackathonList.hackathons.filter((hackathon) => {
      return hackathon.title.includes(value)
    })

    const selectedHackathonID = getHackathon.map(
      (hackathon, index) => hackathon.id
    )

    setSelectedHackweek(selectedHackathonID.toString())
  }

  useEffect(() => {
    loadHackathons()
  }, [])

  return (
    <>
      {isLoadingHackathonList && <div>hackathon select is loading...</div>}
      {!isLoadingHackathonList && (
        <div style={{ width: 250 }}>
          <Select
            placeholder={'select a Hackathon'}
            maxDropdownHeight={280}
            data={data}
            onChange={selectChange}
          />
        </div>
      )}

      <h1>Selected Hackweek:</h1>
      <div>
        <NewHackathonDetails
          hackathonID={selectedHackweek.toString()}
          type={'header'}
        />
      </div>
    </>
  )
}
