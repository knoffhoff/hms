import React, { useState } from 'react'
import { getHackathonDetails } from '../actions/GetBackendData'
import IdeaCardList from './IdeaCardList'

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
    ideas: [],
  })

  console.log('hackathonData from detail component')
  console.log(hackathonData)

  const {
    errorhackathonData,
    isLoadinghackathonData,
    title,
    startDate,
    endDate,
    participantIds,
    categoryIds,
    ideas,
  } = hackathonData

  const loadSelectedHackathon = () => {
    getHackathonDetails(hackathonID.toString()).then(
      (data) => {
        setHackathonData({
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          participantIds: data.participants,
          categoryIds: data.categories,
          ideas: data.ideas,
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
          <h3>Hackathon details are loading...</h3>
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

          <IdeaCardList ideaPreviews={ideas} columnSize={6} type={'Archive'} />
        </div>
      )}
    </>
  )
}
