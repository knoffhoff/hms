import React, { useEffect, useState } from 'react'
import { getHackathonDetails } from '../actions/GetBackendData'
import IdeaCardList from './IdeaCardList'
import { Hackathon } from '../common/types'

type IProps = {
  hackathonID: string
}

export default function HackathonDetails(props: IProps) {
  const { hackathonID } = props
  const [hackathonData, setHackathonData] = useState({
    errorHackathonData: false,
    isLoadingHackathonData: true,
    title: 'string',
    startDate: 'string',
    endDate: 'string',
    participants: [],
    categories: undefined,
    ideas: [],
  } as Hackathon)

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
      {hackathonData.errorHackathonData && (
        <div>
          <h3>Error loading hackathons</h3>
          <p>something went wrong.</p>
        </div>
      )}
      {hackathonData.isLoadingHackathonData && (
        <div>
          <h3>Hackathon details are loading...</h3>
        </div>
      )}

      {hackathonData.startDate && (
        <div>
          <h2>Title: {hackathonData.title}</h2>
          <h2>
            Date from: {new Date(hackathonData.startDate).toDateString()} to:{' '}
            {new Date(hackathonData.endDate).toDateString()}
          </h2>

          <IdeaCardList
            ideaPreviews={hackathonData.ideas!}
            columnSize={6}
            type={'Archive'}
          />
        </div>
      )}
    </>
  )
}
