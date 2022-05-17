import React, { useEffect, useState } from 'react'
import { Hackathon, HackathonPreview } from '../common/types'
import {
  getHackathonDetails,
  getListOfHackathons,
} from '../actions/HackathonActions'
import HackathonSelectDropdown from '../components/HackathonSelectDropdown'

function Home() {
  const [hackathonList, setHackathonList] = useState<HackathonPreview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHackathonID, setSelectedHackathonID] = useState('')
  const today = new Date()
  const [hackathonData, setHackathonData] = useState<Hackathon>({
    id: 'string',
    title: 'string',
    startDate: new Date(),
    endDate: new Date(),
    participants: [],
    categories: undefined,
    ideas: [],
  })

  const loadHackathons = () => {
    getListOfHackathons().then((data) => {
      setHackathonList(data.hackathons)
      setIsLoading(false)
    })
  }

  const loadSelectedHackathon = () => {
    getHackathonDetails(selectedHackathonID).then((data) => {
      setHackathonData({
        id: data.id,
        title: data.title,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        participants: data.participants,
        categories: data.categories,
        ideas: data.ideas,
      })
    })
  }

  const getNextHackathon = hackathonList.filter((hackathon) => {
    return new Date(hackathon.startDate) > today
  })

  const timeTillNextHackathon = !isLoading
    ? new Date(getNextHackathon[0].startDate).getTime() - today.getTime()
    : today.getTime()

  useEffect(() => {
    loadHackathons()
  }, [])

  useEffect(() => {
    localStorage.getItem(selectedHackathonID)
      ? setHackathonData(JSON.parse(localStorage.getItem(selectedHackathonID)!))
      : loadSelectedHackathon()
  }, [selectedHackathonID])

  useEffect(() => {
    //Todo: write this data into localstorage
    localStorage.getItem(hackathonData.id)
      ? console.log(
          'id exist',
          JSON.parse(localStorage.getItem(hackathonData.id)!)
        )
      : localStorage.setItem(hackathonData.id, JSON.stringify(hackathonData))
  }, [hackathonData])

  return (
    <>
      <h1>this is the Startpage</h1>
      <h2>Welcome! here we will give you a short tutorial for this site</h2>
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
        clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
        amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
        nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
        sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
        rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
        ipsum dolor sit amet.
      </p>

      {!isLoading && (
        <h1>
          Time till next Hackathon{' '}
          {
            (timeTillNextHackathon / (1000 * 3600 * 24))
              .toString()
              .split('.')[0]
          }{' '}
          days and {Math.round(timeTillNextHackathon / (1000 * 60 * 60)) % 24}{' '}
          hours
        </h1>
      )}

      {!!selectedHackathonID && (
        <div>
          <h2>{hackathonData.title}</h2>
          <h2>
            Start Date: {new Date(hackathonData.startDate).toDateString()}
          </h2>
          <h2> End Date: {new Date(hackathonData.endDate).toDateString()}</h2>
        </div>
      )}

      <HackathonSelectDropdown
        setHackathonID={setSelectedHackathonID}
        context={'home'}
      />
    </>
  )
}

export default Home
