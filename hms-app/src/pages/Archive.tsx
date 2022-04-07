import React, { useEffect, useState } from 'react'
import { Button, Select } from '@mantine/core'
import { getListOfHackathons } from '../actions/GetBackendData'

export default function Archive() {
  const [hackweek, setHackweek] = useState('placeholder')
  const [hackathonList, setHackathonList] = useState({
    errorhackathonList: false,
    isLoadinghackathonList: true,
    hackathons: [],
  })

  const { errorhackathonList, isLoadinghackathonList, hackathons } =
    hackathonList

  useEffect(() => {
    loadHackathons()
  }, [])

  const loadHackathons = () => {
    getListOfHackathons('hackathons').then(
      (data) => {
        setHackathonList({
          ...hackathonList,
          hackathons: data.ids,
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

  const listHackathons = () => {
    return hackathonList.hackathons.map((hackathon, index) => {
      return <div key={index}>{hackathon}</div>
    })
  }

  const selectChange = (event: { target: { value: any } }) => {
    const value = event.target.value
    setHackweek(value)
  }

  function printHackathons() {
    console.log('hackathons')
    console.log(hackathonList)
    console.log(hackathons)
    /*console.log('1 hackathon')
    console.log(hackathonDetailsList)
    console.log(hackathonTitle)*/
  }

  return (
    <>
      <h1>Selected Hackweek:</h1>
      <h2>{hackweek}</h2>

      <select onChange={selectChange}>
        <option value={hackathons[0]}>last hackweek</option>
        <option value={hackathons[1]}>Current Hackathon</option>
        <option value={hackathons[2]}>next hackweek</option>
      </select>

      <Button onClick={printHackathons}>list hackathons</Button>

      <div>
        <h2> hackathon id list (with loading delay)</h2>
        {errorhackathonList && (
          <div>
            <h3>Error loading hackathons</h3>
            <p>something went wrong.</p>
          </div>
        )}
        {isLoadinghackathonList && (
          <div>
            <h3>Loading...</h3>
            <p>Data is coming.</p>
          </div>
        )}
        <div>{hackathons && listHackathons()}</div>
      </div>
    </>
  )
}
