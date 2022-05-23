import React, { useState } from 'react'
import { Hackathon, HackathonPreview, Idea } from '../common/types'
import HackathonSelectDropdown, {
  HackathonDropdownMode,
} from '../components/HackathonSelectDropdown'
import RelevantIdeasLoader from '../components/RelevantIdeasLoader'

function Home() {
  const [hackathonList, setHackathonList] = useState<HackathonPreview[]>([])
  const [isHackathonsLoading, setIsHackathonsLoading] = useState(true)
  const [isIdeaLoading, setIsIdeaLoading] = useState(true)
  const [selectedHackathonId, setSelectedHackathonId] = useState('')
  const [relevantIdeaList, setRelevantIdeas] = useState<Idea[]>([])
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
  const [nextHackathon, setNextHackathon] = useState<HackathonPreview>({
    endDate: new Date(),
    id: '',
    startDate: new Date(),
    title: '',
  })

  const timeTillNextHackathon = !isHackathonsLoading
    ? nextHackathon.startDate.getTime() - today.getTime()
    : today.getTime()

  return (
    <>
      <RelevantIdeasLoader
        setHackathon={setHackathonData}
        setRelevantIdeas={setRelevantIdeas}
        selectedHackathonId={selectedHackathonId}
        setLoading={setIsIdeaLoading}
      />

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

      {!isHackathonsLoading && (
        <div>
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
          <h2>Next Hackathon: {nextHackathon.title}</h2>
        </div>
      )}

      {!!selectedHackathonId && (
        <div>
          <h2>{hackathonData.title}</h2>
          <h2>
            Start Date: {new Date(hackathonData.startDate).toDateString()}
          </h2>
          <h2> End Date: {new Date(hackathonData.endDate).toDateString()}</h2>
        </div>
      )}

      <HackathonSelectDropdown
        setHackathonId={setSelectedHackathonId}
        context={HackathonDropdownMode.Home}
        setNextHackathon={setNextHackathon}
      />
    </>
  )
}

export default Home
