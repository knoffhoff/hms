import React, { useEffect, useState } from 'react'
import { Button, Select } from '@mantine/core'
import {
  getHackathonDetails,
  getListOfHackathons,
} from '../actions/GetBackendData'

export default function Archive() {
  const [selectedHackweek, setSelectedHackweek] = useState()
  const [hackathonList, setHackathonList] = useState({
    errorhackathonList: false,
    isLoadinghackathonList: true,
    hackathons: [],
  })
  const [hackathonData, setHackathonData] = useState({
    errorhackathonData: false,
    isLoadinghackathonData: true,
    title: 'string',
    startDate: '',
    endDate: '',
    participantIds: [],
    categoryIds: [],
    ideaIds: [],
  })

  const { errorhackathonList, isLoadinghackathonList, hackathons } =
    hackathonList
  const {
    errorhackathonData,
    isLoadinghackathonData,
    title,
    startDate,
    endDate,
    participantIds,
    categoryIds,
    ideaIds,
  } = hackathonData

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

  const loadSelectedHackathon = () => {
    getHackathonDetails(selectedHackweek).then(
      (data) => {
        setHackathonData({
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          participantIds: data.participantIds,
          categoryIds: data.categoryIds,
          ideaIds: data.ideaIds,
          errorhackathonData: false,
          isLoadinghackathonData: false,
        })
      },
      () => {
        setHackathonData({
          ...hackathonData,
          errorhackathonData: true,
          isLoadinghackathonData: false,
        })
      }
    )
  }

  const selectChange = (event: { target: { value: any } }) => {
    const value = event.target.value
    setSelectedHackweek(value)

    //Todo find another place to call this function because it gets called before the hackathon changed
    loadSelectedHackathon()
  }

  useEffect(() => {
    loadHackathons()
  }, [])

  function printHackathons() {
    console.log('hackathons')
    console.log(hackathonList)
    console.log(hackathons)
    console.log('1 hackathon')
    console.log(hackathonData)
    console.log(title)
  }

  return (
    <>
      <h1>Selected Hackweek:</h1>
      <h3>ID: {selectedHackweek}</h3>
      <h2>Title: {title}</h2>
      {startDate && (
        <h2>
          Date from: {startDate.slice(0, 10)} to: {endDate.slice(0, 10)}
        </h2>
      )}

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
