import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Button, Select } from '@mantine/core'
import { useFullscreen } from '@mantine/hooks'
import { HackathonPreview } from '../common/types'
import { getListOfHackathons } from '../actions/HackathonActions'

export default function Presentations() {
  const { ref, toggle, fullscreen } = useFullscreen()
  const [selectedHackweek, setSelectedHackweek] = useState('')
  const [hackathonList, setHackathonList] = useState({
    errorHackathonList: false,
    isLoadingHackathonList: true,
    hackathons: [] as HackathonPreview[],
  })

  const loadHackathons = () => {
    getListOfHackathons().then(
      (data) => {
        setHackathonList({
          ...hackathonList,
          hackathons: data.hackathons,
          errorHackathonList: false,
          isLoadingHackathonList: false,
        })
      },
      () => {
        setHackathonList({
          ...hackathonList,
          errorHackathonList: true,
          isLoadingHackathonList: false,
        })
      }
    )
  }

  const hackathonMap = hackathonList.hackathons.map((hackathon, index) => ({
    value: hackathon.id,
    label: hackathon.title,
  }))

  const selectChange = (value: string) => {
    setSelectedHackweek(value)
  }

  useEffect(() => {
    loadHackathons()
  }, [])

  return (
    <>
      <Button component={Link} to="/admin">
        Back
      </Button>
      <Button onClick={toggle} color={fullscreen ? 'red' : 'blue'}>
        {fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      </Button>
      <h1>Fullscreen page for presentations</h1>

      {hackathonList.isLoadingHackathonList && (
        <div>hackathon select is loading...</div>
      )}
      {!hackathonList.isLoadingHackathonList && (
        <div style={{ width: 250 }}>
          <Select
            placeholder={'select a Hackathon'}
            maxDropdownHeight={280}
            data={hackathonMap}
            onChange={selectChange}
          />
        </div>
      )}

      <Avatar
        ref={ref}
        color="indigo"
        radius="xl"
        size="xl"
        src={'https://unsplash.com/image.jpg'}
      />
    </>
  )
}
