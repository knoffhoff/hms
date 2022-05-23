import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import { Select, SelectItem } from '@mantine/core'
import { HackathonPreview } from '../common/types'

type Props = {
  setHackathonId: (hackthonID: string) => void
  context: HackathonDropdownMode
}

export enum HackathonDropdownMode {
  Archive = 'ARCHIVE',
  IdeaPortal = 'IDEA_PORTAL',
  Home = 'HOME',
  YourIdeas = 'YOUR_IDEAS',
}

export default function HackathonSelectDropdown({
  setHackathonId,
  context,
}: Props) {
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonList, setHackathonList] = useState<HackathonPreview[]>([])
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const loadHackathons = () => {
    getListOfHackathons().then(
      (data) => {
        setHackathonList(data)
        setIsLoading(false)
        setIsError(false)
      },
      () => {
        setIsError(true)
        setIsLoading(false)
      }
    )
  }

  function getHackathonsSelectItems(): SelectItem[] {
    switch (context) {
      case HackathonDropdownMode.Archive:
        return hackathonList
          .filter((hackathon) => hackathon.endDate < today)
          .map((hackathon) => mapHackathonToSelectItem(hackathon))
      case HackathonDropdownMode.IdeaPortal:
        return hackathonList
          .filter((hackathon) => hackathon.endDate >= today)
          .map((hackathon) => mapHackathonToSelectItem(hackathon))
    }
    return hackathonList.map((hackathon) => mapHackathonToSelectItem(hackathon))
  }

  function mapHackathonToSelectItem(hackathon: HackathonPreview): SelectItem {
    return {
      value: hackathon.id,
      label:
        hackathon.title +
        ' ' +
        hackathon.startDate.toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }) +
        '-' +
        hackathon.endDate.toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
    }
  }

  useEffect(() => {
    localStorage.getItem('lastSelectedHackathonId')
      ? setHackathonId(
          JSON.parse(localStorage.getItem('lastSelectedHackathonId')!)
        )
      : console.log('no last hackathon')

    loadHackathons()
  }, [])

  function onChange(value: string) {
    localStorage.setItem('lastSelectedHackathonId', JSON.stringify(value))
    setHackathonId(value)
  }

  return (
    <>
      {isError && <div>Ups something went wrong...</div>}
      {isLoading && !isError && <div>hackathon select is loading...</div>}
      {!isLoading && !isError && (
        <div style={{ width: 385 }}>
          <Select
            placeholder={'select a Hackathon'}
            maxDropdownHeight={280}
            data={getHackathonsSelectItems()}
            onChange={onChange}
          />
        </div>
      )}
    </>
  )
}
