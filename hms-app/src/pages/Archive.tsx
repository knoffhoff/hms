import React, { useEffect, useState } from 'react'
import ideaData from '../test/TestIdeaData'
import IdeaCardList from '../components/IdeaCardList'
import { Idea, Hackathon } from '../common/types'
import { Button } from '@mantine/core'
import { getListOfHackathons } from '../actions/GetBackendData'

export default function Archive() {
  type Hackathon = {
    error: boolean
    isLoading: boolean
    hackathons: string[]
    pagination: string
  }
  const [values, setValues] = useState<Hackathon>({
    error: false,
    isLoading: true,
    hackathons: [],
    pagination: '',
  })

  const { error, isLoading, hackathons, pagination } = values

  useEffect(() => {
    loadHackathons()
  }, [])

  const loadHackathons = () => {
    getListOfHackathons('hackathons').then(
      (data) => {
        setValues({
          ...values,
          hackathons: data,
          error: false,
          isLoading: false,
        })
      },
      () => {
        setValues({ ...values, error: true, isLoading: false })
      }
    )
  }

  const listHackathons = () => {
    return JSON.stringify(values.hackathons)
  }

  const listHackathons2 = () => {
    return Object.entries(hackathons).map((hackathon, index) => {
      return <div key={index}>{hackathon[1][index]}</div>
    })
  }

  function printHackathons() {
    console.log('hackathons')
    console.log(values)
    console.log(hackathons)
    console.log(values.hackathons)
    console.log({ hackathons }.hackathons)
  }

  return (
    <>
      <h1>this is the Archive</h1>
      <Button onClick={printHackathons}>list hackathons</Button>
      <div>
        {error && (
          <div>
            <h3>Error loading hackathons</h3>
            <p>something went wrong.</p>
          </div>
        )}
        {isLoading && (
          <div>
            <h3>Loading...</h3>
            <p>Data is coming.</p>
          </div>
        )}
        <div>List hackathons mit stringify values.hackathons</div>
        <div>{hackathons && listHackathons()}</div>
        <div>try to map the hackathons and show every id alone</div>
        <div>{hackathons && listHackathons2()}</div>
      </div>

      {/*<IdeaCardList
        ideas={ideaData as Idea[]}
        columnSize={6}
        type={'archive'}
      />*/}
    </>
  )
}
