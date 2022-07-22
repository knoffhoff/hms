import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import { Select, SelectItem } from '@mantine/core'
import { HackathonPreview, HackathonDropdownMode } from '../common/types'
import { AlertCircle } from 'tabler-icons-react'
import { useMsal } from '@azure/msal-react'

type Props = {
  setHackathonId: (hackthonID: string) => void
  context: HackathonDropdownMode
}

export default function HackathonSelectDropdown({
  setHackathonId,
  context,
}: Props) {
  const { instance } = useMsal()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonList, setHackathonList] = useState<HackathonPreview[]>([])
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const loadHackathons = () => {
    getListOfHackathons(instance).then(
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
    loadHackathons()
  }, [])

  return (
    <>
      {isError && (
        <Select
          data={['']}
          placeholder={'Could not fetch hackathons'}
          icon={<AlertCircle />}
          disabled
          error
        ></Select>
      )}
      {isLoading && !isError && (
        <Select data={['']} placeholder={'Loading...'} disabled></Select>
      )}
      {!isLoading && !isError && (
        <div style={{ width: 385 }}>
          <Select
            placeholder={'select a Hackathon'}
            maxDropdownHeight={280}
            data={getHackathonsSelectItems()}
            onChange={setHackathonId}
          />
        </div>
      )}
    </>
  )
}
