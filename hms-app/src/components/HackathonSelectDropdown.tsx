import React, { useEffect, useState, useMemo } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import { Select, SelectItem } from '@mantine/core'
import { HackathonDropdownMode, HackathonPreview } from '../common/types'
import { AlertCircle } from 'tabler-icons-react'
import { useMsal } from '@azure/msal-react'
import { useAppSelector } from '../hooks'
import { MAX_DATE, MIN_DATE } from '../common/constants'
import { useParams } from 'react-router-dom'

type Props = {
  setHackathonId: (hackthonID: string) => void
  context: HackathonDropdownMode
}

const getHackathonsSelectItems = (
  hackathonList: HackathonPreview[],
  context: HackathonDropdownMode,
  today: Date
): SelectItem[] => {
  switch (context) {
    case HackathonDropdownMode.Archive:
      return hackathonList
        .filter(
          (hackathon) =>
            hackathon.endDate < today && hackathon.endDate > MIN_DATE
        )
        .map((hackathon) => mapHackathonToSelectItem(hackathon))
    case HackathonDropdownMode.Hackathons:
      return hackathonList
        .filter((hackathon) => hackathon.endDate >= today)
        .map((hackathon) => mapHackathonToSelectItem(hackathon))
    case HackathonDropdownMode.MoveModal:
      return hackathonList.map((hackathon) =>
        mapHackathonToSelectItem(hackathon)
      )
  }
  return hackathonList
    .filter((hackathon) => hackathon.endDate > MIN_DATE)
    .map((hackathon) => mapHackathonToSelectItem(hackathon))
}

const mapHackathonToSelectItem = (hackathon: HackathonPreview): SelectItem => {
  if (hackathon.endDate < MIN_DATE || hackathon.endDate > MAX_DATE) {
    return {
      value: hackathon.id,
      label: hackathon.title,
    }
  } else {
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
}

export default function HackathonSelectDropdown({
  setHackathonId,
  context,
}: Props) {
  const { slug } = useParams()
  const { instance } = useMsal()
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hackathonList, setHackathonList] = useState<HackathonPreview[]>([])
  const [selectedHackathon, setSelectedHackathon] = useState<HackathonPreview>()
  const nextHackathon = useAppSelector(
    (state) => state.hackathons.nextHackathon
  )
  const lastSelectedHackathon = useAppSelector(
    (state) => state.hackathons.lastSelectedHackathon
  )
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const loadHackathons = () => {
    getListOfHackathons(instance).then(
      (data) => {
        setHackathonList(data)
        const upcomingHackathon = data.find((h) => h.id === nextHackathon.id)
        if (slug) {
          const hackathon = data.find((h) => h.slug === slug)
          if (hackathon) {
            setSelectedHackathon(hackathon)
            setHackathonId(hackathon.id)
          }
        } else if (
          upcomingHackathon &&
          context !== HackathonDropdownMode.Archive
        ) {
          setHackathonId(upcomingHackathon.id)
          setSelectedHackathon(upcomingHackathon)
        }
        setIsLoading(false)
        setIsError(false)
      },
      () => {
        setIsError(true)
        setIsLoading(false)
      }
    )
  }

  useEffect(() => {
    loadHackathons()
  }, [])

  const selectItems = useMemo(
    () => getHackathonsSelectItems(hackathonList, context, today),
    [hackathonList, context, today]
  )

  return (
    <>
      {isError && (
        <Select
          data={['']}
          placeholder={'Could not fetch hackathons'}
          icon={<AlertCircle />}
          disabled
          error
        />
      )}
      {isLoading && !isError && (
        <Select data={['']} placeholder={'Loading...'} disabled />
      )}
      {!isLoading && !isError && (
        <div style={{ width: 385 }}>
          <Select
            placeholder={'Select a hackathon'}
            defaultValue={selectedHackathon?.id}
            maxDropdownHeight={280}
            data={selectItems}
            onChange={setHackathonId}
          />
        </div>
      )}
    </>
  )
}
