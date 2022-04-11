import React, { useEffect, useState } from 'react'
import { Button, Select } from '@mantine/core'
import {
  getHackathonDetails,
  getListOfHackathons,
} from '../actions/GetBackendData'
import HackathonDetails from '../components/HackathonDetails'

export default function Archive() {
  const [selectedHackweek, setSelectedHackweek] = useState(
    '8a3a2bd9-c32a-47d9-a925-c14405e6a51a'
  )
  const [hackathonList, setHackathonList] = useState({
    errorhackathonList: false,
    isLoadinghackathonList: true,
    id: [],
    title: [],
  })

  const { errorhackathonList, isLoadinghackathonList, id, title } =
    hackathonList

  const loadHackathons = () => {
    getListOfHackathons('hackathons').then(
      (data) => {
        setHackathonList({
          ...hackathonList,
          id: data.hackathons.id,
          title: data.title,
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
        console.log('fuuuuuuuck')
      }
    )
  }

  const optionsList = () => {
    return hackathonList.id.map((hackathon, index) => {
      return <option value={id[index]}>{hackathon}</option>
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
    console.log('hackathonList')
    console.log(hackathonList)
    console.log(id)
    console.log(title)
    console.log('1 hackathon')
  }

  console.log('hackathonList')
  console.log(hackathonList)
  console.log('hackathonIDs')
  console.log(id)
  console.log('hackathontitles')
  console.log(title)
  loadHackathons()

  return (
    <>
      {/*{isLoadinghackathonList && <div>is loading</div>}
      {!isLoadinghackathonList && (
        <select onChange={selectChange}>{optionsList()}</select>
      )}*/}

      <Button onClick={printHackathons}>list hackathons</Button>

      <h1>Selected Hackweek:</h1>
      <HackathonDetails hackathonID={selectedHackweek.toString()} />
    </>
  )
}
