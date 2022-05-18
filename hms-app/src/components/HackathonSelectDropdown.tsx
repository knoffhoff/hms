import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import { Select, SelectItem } from '@mantine/core'
import { HackathonPreview } from '../common/types'

type Props = {
  setHackathonId: (hackthonID: string) => void
  context: string
}

export default function HackathonSelectDropdown({
  setHackathonId,
  context,
}: Props) {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonList, setHackathonList] = useState<HackathonPreview[]>([])
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

  const futureAndPresentHackathons = hackathonList.filter((hackathon) => {
    return new Date(hackathon.endDate) > today
  })

  const pastHackathons = hackathonList.filter((hackathon) => {
    return new Date(hackathon.endDate) < today
  })

  function getHackatonsForContext(): HackathonPreview[] {
    switch (context) {
      case 'archive':
        return pastHackathons
      case 'idea-portal':
        return futureAndPresentHackathons
    }
    return hackathonList
  }

  function mapHackathonToSelectItem(hackathon: HackathonPreview): SelectItem {
    return {
      value: hackathon.id,
      label:
        hackathon.title +
        ' ' +
        new Date(hackathon.startDate).toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }) +
        '-' +
        new Date(hackathon.endDate).toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
    }
  }

  const hackathonMap = getHackatonsForContext().map((hackathon) =>
    mapHackathonToSelectItem(hackathon)
  )

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
            onChange={setHackathonId}
          />
        </div>
      )}
    </>
  )
}
