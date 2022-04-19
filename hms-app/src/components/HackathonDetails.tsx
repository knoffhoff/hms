import React, { useEffect, useState } from 'react'
import { getHackathonDetails } from '../actions/GetBackendData'
import IdeaCardList from './IdeaCardList'

type IProps = {
  hackathonID: string
}

export default function HackathonDetails(props: IProps) {
  const { hackathonID } = props
  const [hackathonData, setHackathonData] = useState({
    errorHackathonData: false,
    isLoadingHackathonData: true,
    title: 'string',
    startDate: '',
    endDate: '',
    participants: [],
    categories: [],
    ideas: [],
  })

  const {
    errorHackathonData,
    isLoadingHackathonData,
    title,
    startDate,
    endDate,
    participants,
    categories,
    ideas,
  } = hackathonData

  const loadSelectedHackathon = () => {
    getHackathonDetails(hackathonID).then(
      (data) => {
        setHackathonData({
          title: data.title,
          startDate: data.startDate,
          endDate: data.endDate,
          participants: data.participants,
          categories: data.categories,
          ideas: data.ideas,
          errorHackathonData: false,
          isLoadingHackathonData: false,
        })
      },
      () => {
        setHackathonData({
          ...hackathonData,
          errorHackathonData: true,
          isLoadingHackathonData: false,
        })
      }
    )
  }

  useEffect(() => {
    loadSelectedHackathon()
  }, [hackathonID])

  return (
    <>
      {errorHackathonData && (
        <div>
          <h3>Error loading hackathons</h3>
          <p>something went wrong.</p>
        </div>
      )}
      {isLoadingHackathonData && (
        <div>
          <h3>Hackathon details are loading...</h3>
        </div>
      )}

      {startDate && (
        <div>
          <h2>Title: {hackathonData.title}</h2>
          <h2>
            Date from: {new Date(startDate).toDateString()} to:{' '}
            {new Date(endDate).toDateString()}
          </h2>

          <IdeaCardList ideaPreviews={ideas} columnSize={6} type={'Archive'} />
        </div>
      )}
    </>
  )
}
