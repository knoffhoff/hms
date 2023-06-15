import React, { useEffect, useState } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import { Select, SelectItem } from '@mantine/core'
import { HackathonDropdownMode, HackathonPreview } from '../common/types'
import { AlertCircle } from 'tabler-icons-react'
import { useMsal } from '@azure/msal-react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MAX_DATE, MIN_DATE } from '../common/constants'
import { useParams } from 'react-router-dom'
import {
  mapHackathonToSerializable,
  setLastSelectedHackathon,
} from '../common/redux/hackathonSlice'

type Props = {
  setHackathonId: (hackthonID: string) => void
  context: HackathonDropdownMode
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

  const previousSelectedHackathon = useAppSelector(
    (state) => state.hackathons.lastSelectedHackathon
  )
  const [lastSelectedID, setLastSelectedID] = useState('')
  const dispatch = useAppDispatch()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const loadHackathons = () => {
    getListOfHackathons(instance).then(
      (data) => {
        setHackathonList(data)

        const lastSelectedHackathon = data.find(
          (h) => h.id === previousSelectedHackathon.id
        )
        if (slug) {
          const hackathon = data.find((h) => h.slug === slug)
          if (hackathon) {
            setSelectedHackathon(hackathon)
            setHackathonId(hackathon.id)
          }
        } else if (
          lastSelectedHackathon &&
          context !== HackathonDropdownMode.Archive
        ) {
          setHackathonId(lastSelectedHackathon.id)
          setSelectedHackathon(lastSelectedHackathon)
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

  function getHackathonsSelectItems(): SelectItem[] {
    switch (context) {
      case HackathonDropdownMode.Archive:
        return hackathonList
          .filter(
            (hackathon) =>
              hackathon.endDate < today && hackathon.endDate > MIN_DATE
          )
          .map((hackathon) => mapHackathonToSelectItem(hackathon))
      case HackathonDropdownMode.IdeaPortal:
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

  function mapHackathonToSelectItem(hackathon: HackathonPreview): SelectItem {
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

  const updateLastSelectedHackathon = () => {
    getListOfHackathons(instance).then((data) => {
      if (lastSelectedID !== '') {
        const lastSelectedHackathon = data.find((h) => h.id === lastSelectedID)

        if (lastSelectedHackathon) {
          dispatch(
            setLastSelectedHackathon(
              mapHackathonToSerializable(lastSelectedHackathon)
            )
          )
        }
      }
    })
  }

  const handleHackathonSelect = (selectedId: string) => {
    setLastSelectedID(selectedId)
  }

  useEffect(() => {
    loadHackathons()
  }, [previousSelectedHackathon])

  useEffect(() => {
    updateLastSelectedHackathon()
  }, [lastSelectedID])

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
            data={getHackathonsSelectItems()}
            onChange={handleHackathonSelect}
          />
        </div>
      )}
    </>
  )
}
