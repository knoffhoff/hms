import React, {useEffect, useState} from 'react'
import {Button} from '@mantine/core'
import {getListOfHackathons,} from '../actions/GetBackendData'
import HackathonDetails from '../components/HackathonDetails'

interface HackathonPreview {
  id: string;
  title: string;
}

export default function Archive() {
  const [selectedHackweek, setSelectedHackweek] = useState(
    '4eb2d486-c786-431e-a4fd-4c093ed30642'
  )
  const [hackathonList, setHackathonList] = useState({
    errorhackathonList: false,
    isLoadinghackathonList: true,
    hackathons: [] as HackathonPreview[],
  })

  const { errorhackathonList, isLoadinghackathonList, hackathons }
      = hackathonList

  const loadHackathons = () => {
    getListOfHackathons('hackathons').then(
      (data) => {
        setHackathonList({
          ...hackathonList,
          hackathons: data.hackathons,
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
    return hackathonList.hackathons.map((hackathon, index) => {
      return <option value={hackathon.id}>{hackathon.id}</option>
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
    console.log('1 hackathon')
  }

  console.log('hackathonList')
  console.log(hackathonList)
  console.log('hackathonIDs')
  console.log('hackathontitles')
  loadHackathons()

  return (
    <>
      {isLoadinghackathonList && <div>is loading</div>}
      {!isLoadinghackathonList && (
        <select onChange={selectChange}>{optionsList()}</select>
      )}

      <Button onClick={printHackathons}>list hackathons</Button>

      <h1>Selected Hackweek:</h1>
      <HackathonDetails hackathonID={selectedHackweek.toString()} />
    </>
  )
}
