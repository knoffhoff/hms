import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import { Select } from '@mantine/core'
import { HackathonPreview } from '../common/types'

type Props = {
  setHackathonID: (hackthonID: string) => void
  context: string
}

export default function HackathonSelectDropdown({
  setHackathonID,
  context,
}: Props) {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonList, setHackathonList] = useState([] as HackathonPreview[])
  const today = new Date()

  const loadHackathons = () => {
    getListOfHackathons().then(
      (data) => {
        setHackathonList(data.hackathons)
        setIsLoading(false)
        setIsError(false)
      },
      () => {
        setIsError(true)
        setIsLoading(false)
      }
    )
  }

  const hackathonDateCurrentAndFuture = hackathonList.filter((hackathon) => {
    return (
      new Date(hackathon.startDate) > today ||
      new Date(hackathon.endDate) > today
    )
  })

  const hackathonDatePast = hackathonList.filter((hackathon) => {
    return new Date(hackathon.endDate) < today
  })

  const hackathonMap = (
    context === 'archive'
      ? hackathonDatePast
      : context === 'idea-portal'
      ? hackathonDateCurrentAndFuture
      : hackathonList
  ).map((hackathon, index) => ({
    value: hackathon.id,
    label:
      hackathon.title +
      ' ' +
      new Date(hackathon.startDate).toLocaleString(undefined, {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      }) +
      '-' +
      new Date(hackathon.endDate).toLocaleString(undefined, {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      }),
  }))

  useEffect(() => {
    loadHackathons()
  }, [])

  return (
    <>
      {isError && <div>Ups something went wrong...</div>}
      {isLoading && !isError && <div>hackathon select is loading...</div>}
      {!isLoading && !isError && (
        <div style={{ width: 385 }}>
          <Select
            placeholder={'select a Hackathon'}
            maxDropdownHeight={280}
            data={hackathonMap}
            onChange={setHackathonID}
          />
        </div>
      )}
    </>
  )
}
