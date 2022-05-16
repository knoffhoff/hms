import React, { useEffect, useState } from 'react'
import { HackathonPreview } from '../common/types'
import { getListOfHackathons } from '../actions/HackathonActions'

function Home() {
  const [hackathonList, setHackathonList] = useState([] as HackathonPreview[])
  const [isLoading, setIsLoading] = useState(true)
  const today = new Date()

  const loadHackathons = () => {
    getListOfHackathons().then((data) => {
      setHackathonList(data.hackathons)
      setIsLoading(false)
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
        <div>
          <h1>
            Time till next Hackathon{' '}
            {Math.round(timeTillNextHackathon / (1000 * 3600 * 24))} days and{' '}
            {Math.round(timeTillNextHackathon / (1000 * 60 * 60)) % 24} hours
          </h1>

          <h2>{getNextHackathon[0].title}</h2>
          <h2>
            Start Date: {new Date(getNextHackathon[0].startDate).toDateString()}
          </h2>
          <h2>
            {' '}
            End Date: {new Date(getNextHackathon[0].endDate).toDateString()}
          </h2>
        </div>
      )}
    </>
  )
}

export default Home
