import React, { useEffect, useState } from 'react'
import { Button, Select } from '@mantine/core'
import { getHackathonDetails } from '../actions/GetBackendData'
import { Hackathon } from '../common/types'
import IdeaCardList from './IdeaCardList'
import testIdeaData from '../test/TestIdeaData'

type IProps = {
  hackathonID: string
}

export default function HackathonDetails(props: IProps) {
  const { hackathonID } = props
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

  const loadSelectedHackathon = () => {
    getHackathonDetails(hackathonID.toString()).then(
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

  /*useEffect(() => {
    setHackathonData({ ...hackathonData, isLoadinghackathonData: true })
    loadSelectedHackathon()
  }, [])*/

  console.log('hackathonData from detail component')
  console.log(hackathonData)

  loadSelectedHackathon()

  return (
    <>
      {errorhackathonData && (
        <div>
          <h3>Error loading hackathons</h3>
          <p>something went wrong.</p>
        </div>
      )}
      {isLoadinghackathonData && (
        <div>
          <h3>Loading...</h3>
          <p>Data is coming.</p>
        </div>
      )}

      {startDate && (
        <div>
          <p>selected ID: {hackathonID}</p>
          <h2>Title: {hackathonData.title}</h2>
          <h2>
            Date from: {hackathonData.startDate.slice(0, 10)} to:{' '}
            {hackathonData.endDate.slice(0, 10)}
          </h2>

          <IdeaCardList ideas={testIdeaData} columnSize={6} type={'Archive'} />
        </div>
      )}
    </>
  )
}
