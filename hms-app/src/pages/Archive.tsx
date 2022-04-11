import React, { useEffect, useState } from 'react'
import { Button, Select } from '@mantine/core'
import {
  getHackathonDetails,
  getListOfHackathons,
} from '../actions/GetBackendData'
import HackathonDetails from '../components/HackathonDetails'

export default function Archive() {
  const [selectedHackweek, setSelectedHackweek] = useState(
    '5b0f96f1-1056-4e62-9abd-0b12ab66bb19'
  )
  const [hackathonList, setHackathonList] = useState({
    errorhackathonList: false,
    isLoadinghackathonList: true,
    hackathons: [],
    hackathontitles: [],
  })

  const { errorhackathonList, isLoadinghackathonList, hackathons } =
    hackathonList

  const loadHackathons = () => {
    getListOfHackathons('hackathons').then(
      (data) => {
        setHackathonList({
          ...hackathonList,
          hackathons: data.ids,
          hackathontitles: data.title,
          errorhackathonList: false,
          isLoadinghackathonList: false,
        })
      },
      () => {
        setHackathonList({
          ...hackathonList,
          errorhackathonList: true,
          isLoadinghackathonList: false,
        })
      }
    )
  }

  const optionsList = () => {
    return hackathons.map((hackathon, index) => {
      return <option value={hackathons[index]}>{hackathon}</option>
    })
  }

  const selectChange = (event: { target: { value: any } }) => {
    const value = event.target.value
    setSelectedHackweek(value)
  }

  useEffect(() => {
    loadHackathons()
  }, [])

  function printHackathons() {
    console.log('hackathons')
    console.log(hackathonList)
    console.log(hackathons)
    console.log('1 hackathon')
  }

  return (
    <>
      <select onChange={selectChange}>{optionsList()}</select>

      <Button onClick={printHackathons}>list hackathons</Button>

      <h1>Selected Hackweek:</h1>
      <HackathonDetails hackathonID={selectedHackweek} />
    </>
  )
}
