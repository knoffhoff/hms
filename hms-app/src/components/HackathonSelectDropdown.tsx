import React, { useEffect, useMemo, useState } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import { Select, SelectItem, Text, Stack } from '@mantine/core'
import { HackathonDropdownMode, HackathonPreview } from '../common/types'
import { AlertCircle } from 'tabler-icons-react'
import { useMsal } from '@azure/msal-react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { MAX_DATE, MIN_DATE } from '../common/constants'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import {
  mapHackathonToSerializable,
  setLastSelectedHackathon,
} from '../common/redux/hackathonSlice'
import { styles } from '../common/styles'

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
  const navigate = useNavigate()
  const location = useLocation()
  const { instance } = useMsal()
  const { classes } = styles()
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
  const dispatch = useAppDispatch()

  const loadHackathons = () => {
    getListOfHackathons(instance).then(
      (data) => {
        setHackathonList(data)
        const upcomingHackathon = data.find((h) => h.id === nextHackathon.id)
        const TempLastSelectedHackathon = data.find(
          (h) => h.id === lastSelectedHackathon.id
        )

        if (slug) {
          const hackathon = data.find((h) => h.slug === slug)
          if (hackathon) {
            setSelectedHackathon(hackathon)
            setHackathonId(hackathon.id)
            if (hackathon.endDate < today) {
              // If currently in /hackathons, redirect to /archive
              if (location.pathname.startsWith('/hackathons')) {
                navigate(`/archive/${hackathon.slug}`)
                return // Exit the function to avoid further navigation
              }
            } else {
              navigate(`/hackathons/${hackathon.slug}`)
            }
          }
        } else if (
          TempLastSelectedHackathon &&
          context === HackathonDropdownMode.Hackathons
        ) {
          setHackathonId(TempLastSelectedHackathon.id)
          setSelectedHackathon(TempLastSelectedHackathon)
          navigate(`/hackathons/${TempLastSelectedHackathon.slug}`)
        } else if (
          upcomingHackathon &&
          context !== HackathonDropdownMode.Archive &&
          context !== HackathonDropdownMode.MoveModal
        ) {
          setHackathonId(upcomingHackathon.id)
          setSelectedHackathon(upcomingHackathon)
          navigate(`/hackathons/${upcomingHackathon.slug}`)
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

  const handleHackathonSelection = (id: string | null) => {
    if (id) {
      const hackathon = hackathonList.find((h) => h.id === id)
      if (hackathon) {
        setHackathonId(id)
        setSelectedHackathon(hackathon)
        if (context !== HackathonDropdownMode.MoveModal) {
          if (location.pathname === '/archive') {
            navigate(`/archive/${hackathon.slug}`)
          } else {
            navigate(`/hackathons/${hackathon.slug}`)
          }
        }
      }
    }
  }

  const selectItems = useMemo(
    () => getHackathonsSelectItems(hackathonList, context, today),
    [hackathonList, context, today]
  )

  useEffect(() => {
    loadHackathons()
  }, [])

  useEffect(() => {
    if (context === HackathonDropdownMode.Hackathons && selectedHackathon) {
      dispatch(
        setLastSelectedHackathon(mapHackathonToSerializable(selectedHackathon))
      )
    }
  }, [selectedHackathon, context, dispatch])

  return (
    <>
      <Stack spacing={0} pt={20}>
        <Text className={classes.title}>Select Hackathon:</Text>

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
              placeholder={'Click here to select a hackathon'}
              defaultValue={selectedHackathon?.id}
              maxDropdownHeight={280}
              data={selectItems}
              onChange={handleHackathonSelection}
              error={
                selectedHackathon === undefined
                  ? 'Please select a hackathon'
                  : false
              }
            />
          </div>
        )}
      </Stack>
    </>
  )
}
