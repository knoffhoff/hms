import React, { useEffect, useState } from 'react'
import { HackathonPreview } from '../common/types'
import { useAppSelector, useAppDispatch } from '../hooks'

function Home() {
  const hackathonState = useAppSelector((state) => state.hackathons)
  const dispatch = useAppDispatch()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [nextHackathon, setNextHackathon] = useState<HackathonPreview>({
    endDate: new Date(),
    id: '',
    startDate: new Date(),
    title: '',
  })

  useEffect(() => {
    if (hackathonState.hackathons.length > 0) {
      const next = hackathonState.hackathons[0]
      if (next) {
        setNextHackathon(next)
      }
    }
  },[]);

  function timeTillNextHackathon() {
    return !!nextHackathon.id
      ? new Date(nextHackathon.startDate).getTime() - today.getTime()
      : 0
  }

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

      {!!localStorage.getItem('nextHackathon') && (
        <div>
          <h2>
            Time till next Hackathon{' '}
            {
              (timeTillNextHackathon() / (1000 * 3600 * 24))
                .toString()
                .split('.')[0]
            }{' '}
            days and{' '}
            {Math.round(timeTillNextHackathon() / (1000 * 60 * 60)) % 24} hours
          </h2>
          <div>Next Hackathon: {nextHackathon.title}</div>
          <div>
            Start Date: {new Date(nextHackathon.startDate).toLocaleDateString()}
          </div>
          <div>
            End Date: {new Date(nextHackathon.endDate).toLocaleDateString()}
          </div>
        </div>
      )}
    </>
  )
}

export default Home
