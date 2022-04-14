import React, { useEffect, useState } from 'react'
import { Button } from '@mantine/core'
import { getListOfHackathons } from '../actions/GetBackendData'
import HackathonDetails from '../components/HackathonDetails'
import { Select } from '@mantine/core'

interface HackathonPreview {
  id: string
  title: string
}

export default function Archive() {
  const [selectedHackweek, setSelectedHackweek] = useState(
    '260c6b6e-e572-476f-b6e7-4910dd6fba52'
  )
  const [hackathonList, setHackathonList] = useState({
    errorhackathonList: false,
    isLoadinghackathonList: true,
    hackathons: [] as HackathonPreview[],
  })

  const { errorhackathonList, isLoadinghackathonList, hackathons } =
    hackathonList

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
      return <option value={hackathon.id}>{hackathon.title}</option>
    })
  }

  const data = hackathonList.hackathons.map(
    (hackathon, index) => `${hackathon.id}`
  )
  /*const data = [
    {
      value: hackathonList.hackathons
        .map((hackathon, index) => `${hackathon.id}`)
        .toString(),
      label: hackathonList.hackathons
        .map((hackathon, index) => `${hackathon.title}`)
        .toString(),
    },
  ]*/

  const selectChange = (value: string) => {
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

  console.log('selected Hackweek')
  console.log(selectedHackweek)
  console.log('hackathonList')
  console.log(hackathonList)

  return (
    <>
      {isLoadinghackathonList && <div>is loading...</div>}
      {!isLoadinghackathonList && (
        <div style={{ border: '1px solid red', width: 250 }}>
          <Select
            placeholder={'select a Hackweek'}
            maxDropdownHeight={280}
            data={data}
            /*value={selectedHackweek}*/
            onChange={selectChange}
          />
        </div>
      )}

      {/*<Button onClick={printHackathons}>list hackathons</Button>*/}

      <h1>Selected Hackweek:</h1>
      <div style={{ border: '1px solid red' }}>
        <HackathonDetails hackathonID={selectedHackweek.toString()} />
      </div>
    </>
  )
}
