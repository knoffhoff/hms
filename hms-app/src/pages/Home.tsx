import React, { useEffect, useState } from 'react'
import { HackathonPreview } from '../common/types'
import { createStyles, Timeline, Text } from '@mantine/core'
import './timeline.css'

const useStyles = createStyles((theme) => ({
  container: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.md,
    textDecoration: 'none',
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.dark[0],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
  },
}))

function Home() {
  const { classes } = useStyles()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [nextHackathon, setNextHackathon] = useState<HackathonPreview>({
    endDate: new Date(),
    id: '',
    startDate: new Date(),
    title: '',
  })
  const registrationOpenDate = new Date(nextHackathon.startDate)
  registrationOpenDate.setDate(registrationOpenDate.getDate() - 84)
  const registrationClosedDate = new Date(nextHackathon.startDate)
  registrationClosedDate.setDate(registrationClosedDate.getDate() - 1)

  useEffect(() => {
    if (localStorage.getItem('nextHackathon')) {
      setNextHackathon(JSON.parse(localStorage.getItem('nextHackathon')!))
    }
  }, [])

  function timeTillNextHackathonStart() {
    return !!nextHackathon.id
      ? new Date(nextHackathon.startDate).getTime() - today.getTime()
      : 0
  }

  function timeTillNextHackathonEnd() {
    return !!nextHackathon.id
      ? new Date(nextHackathon.endDate).getTime() - today.getTime()
      : 0
  }

  const timeline = (
    <div style={{ padding: 5 }}>
      <Timeline active={3} reverseActive bulletSize={24} lineWidth={2}>
        <Timeline.Item title="Registration and Idea submission open">
          <Text color="dimmed" size="sm">
            {registrationOpenDate.toLocaleDateString()}
          </Text>
          <Text size="xs" mt={4}>
            {
              Math.abs(
                (registrationOpenDate.getTime() - today.getTime()) /
                  (1000 * 3600 * 24)
              )
                .toString()
                .split('.')[0]
            }{' '}
            {registrationOpenDate < today ? 'days ago' : 'days left'}
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title="Registration and Idea submission deadline!"
          lineVariant="dashed"
        >
          <Text color="dimmed" size="sm">
            {registrationClosedDate.toLocaleDateString()}
          </Text>
          <Text size="xs" mt={4}>
            {
              Math.abs(
                (registrationClosedDate.getTime() - today.getTime()) /
                  (1000 * 3600 * 24)
              )
                .toString()
                .split('.')[0]
            }{' '}
            {registrationClosedDate < today ? 'days ago' : 'days left'}
          </Text>
        </Timeline.Item>

        <Timeline.Item title="Start Date" lineVariant="dashed">
          <Text color="dimmed" size="sm">
            {new Date(nextHackathon.startDate).toLocaleDateString()}
          </Text>
          <Text size="xs" mt={4}>
            {
              (timeTillNextHackathonStart() / (1000 * 3600 * 24))
                .toString()
                .split('.')[0]
            }{' '}
            {nextHackathon.startDate < today ? 'days ago' : 'days left'}
          </Text>
        </Timeline.Item>

        <Timeline.Item title="End Date" lineVariant="dashed">
          <Text color="dimmed" size="sm">
            {new Date(nextHackathon.endDate).toLocaleDateString()}
          </Text>
          <Text size="xs" mt={4}>
            {
              (timeTillNextHackathonEnd() / (1000 * 3600 * 24))
                .toString()
                .split('.')[0]
            }{' '}
            {nextHackathon.endDate < today ? 'days ago' : 'days left'}
          </Text>
        </Timeline.Item>

        <Timeline.Item title="award ceremony">
          <Text color="dimmed" size="sm">
            {new Date(nextHackathon.endDate).toLocaleDateString()}
          </Text>
          <Text size="xs" mt={4}>
            {
              (timeTillNextHackathonEnd() / (1000 * 3600 * 24) + 1)
                .toString()
                .split('.')[0]
            }{' '}
            days left
          </Text>
        </Timeline.Item>
      </Timeline>
    </div>
  )

  const timeline4 = (
    <div>
      <ul className="timeline" id="timeline">
        <li className={registrationOpenDate < today ? 'li complete' : 'li'}>
          <div className="timestamp">
            <Text>Registration and Idea submission open</Text>
            <Text color="dimmed" size="sm">
              {registrationOpenDate.toLocaleDateString()}
            </Text>
          </div>
          <div className="status">
            <h4>
              {
                Math.abs(
                  (registrationOpenDate.getTime() - today.getTime()) /
                    (1000 * 3600 * 24)
                )
                  .toString()
                  .split('.')[0]
              }{' '}
              {registrationOpenDate < today ? 'days ago' : 'days left'}
            </h4>
          </div>
        </li>

        <li className={registrationClosedDate < today ? 'li complete' : 'li'}>
          <div className="timestamp">
            <Text>Registration and Idea submission deadline!</Text>
            <Text color="dimmed" size="sm">
              {registrationClosedDate.toLocaleDateString()}{' '}
            </Text>
          </div>
          <div className="status">
            <h4>
              {
                Math.abs(
                  (registrationClosedDate.getTime() - today.getTime()) /
                    (1000 * 3600 * 24)
                )
                  .toString()
                  .split('.')[0]
              }{' '}
              {registrationClosedDate < today ? 'days ago' : 'days left'}
            </h4>
          </div>
        </li>

        <li className={nextHackathon.startDate < today ? 'li complete' : 'li'}>
          <div className="timestamp">
            <Text>Start Date</Text>
            <Text color="dimmed" size="sm">
              {new Date(nextHackathon.startDate).toLocaleDateString()}
            </Text>
          </div>
          <div className="status">
            <h4>
              {
                (timeTillNextHackathonStart() / (1000 * 3600 * 24))
                  .toString()
                  .split('.')[0]
              }{' '}
              {nextHackathon.startDate < today ? 'days ago' : 'days left'}
            </h4>
          </div>
        </li>

        <li className={nextHackathon.endDate < today ? 'li complete' : 'li'}>
          <div className="timestamp">
            <Text>End Date</Text>
            <Text color="dimmed" size="sm">
              {new Date(nextHackathon.endDate).toLocaleDateString()}
            </Text>
          </div>
          <div className="status">
            <h4>
              {
                (timeTillNextHackathonEnd() / (1000 * 3600 * 24))
                  .toString()
                  .split('.')[0]
              }{' '}
              {nextHackathon.endDate < today ? 'days ago' : 'days left'}
            </h4>
          </div>
        </li>

        <li className="li">
          <div className="timestamp">
            <Text>award ceremony</Text>
            <Text color="dimmed" size="sm">
              {new Date(nextHackathon.endDate).toLocaleDateString()}
            </Text>
          </div>
          <div className="status">
            <h4>
              {
                (timeTillNextHackathonEnd() / (1000 * 3600 * 24) + 1)
                  .toString()
                  .split('.')[0]
              }{' '}
              days left
            </h4>
          </div>
        </li>
      </ul>
    </div>
  )

  return (
    <>
      <h1>Welcome to the Hack-week Management System</h1>
      {!!localStorage.getItem('nextHackathon') && (
        <div>
          <h2 style={{ textAlign: 'center' }}>Next Hackathon in</h2>
          <h2 style={{ textAlign: 'center' }}>
            {
              (timeTillNextHackathonStart() / (1000 * 3600 * 24))
                .toString()
                .split('.')[0]
            }{' '}
            days and{' '}
            {Math.round(timeTillNextHackathonStart() / (1000 * 60 * 60)) % 24}{' '}
            hours
          </h2>
          <div>Next Hackathon: {nextHackathon.title}</div>
          <div>
            Start Date: {new Date(nextHackathon.startDate).toLocaleDateString()}
          </div>
          <div>
            End Date: {new Date(nextHackathon.endDate).toLocaleDateString()}
          </div>
          {timeline}
          {timeline4}
        </div>
      )}

      <div className={classes.container}>
        <div>
          <h3>What is a Hack-week?</h3>
          <p>
            In our case, a Hack-week is more or less self - explaining ;) we
            will have a 5-Day long Hack-week that starts on Monday with Idea
            Pitches and ends on Friday with some cool project presentations and
            a winner celebration
          </p>
        </div>
        <div>
          <h3>Why should I Participate?</h3>
          <p>
            Maybe you have a great idea that you have wanted to work on for
            years? Use the chance to build a prototype! Maybe you want to learn
            or test a new framework? Then this is your save space! You have a
            solution for an existing problem? Come and find allies for it.
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
        }}
        className={classes.container}
      >
        <div>
          <h3>How to use this site?</h3>
          <p>
            In the HMS you will be able to participate in a Hackathon, submit
            ideas, see all other ideas and vote for the best idea in the end.
          </p>
        </div>
        <div>
          <h3>How to participate?</h3>
          <p>
            If you want to participate in a Hackathon, navigate to the Idea
            Portal page, select a Hackathon and click on the participate button
          </p>
          ---add screenshot from header here--- ---add screenshot from dropdown
          here--- ---add screenshot from participate button here---
        </div>
        <div>
          <h3>How to find Ideas?</h3>
          <p>
            In the Idea Portal, you can select all upcoming Hackathons to see a
            list of submitted ideas. Also, you have the opportunity to search
            for specific idea titles or to only display your favorite ideas. The
            idea cards itself are expandable, so you can see all relevant
            information and also a list of already pre-registered users that
            want to participate in that idea. If you like an Idea and want to
            participate or just save it to decide later you will find a
            participate and favorite button on the bottom of every expanded idea
            card.
          </p>
          ---add screenshot of a expanded idea card---
        </div>
        <div>
          <h3>How to submit Ideas?</h3>
          <p>
            If you are already registered for a hackathon and want to submit
            your own ideas, navigate to the "Your Ideas" page. In the "Your
            Ideas" page, you can select the Hackathon you want to submit a new
            idea or see a list of your already submitted Ideas To create a new
            Idea Select a Hackathon and then click on Create new Idea, here you
            can fill in all the relevant information. To Edit or Delete and
            already submitted idea, load the hackathon to see your ideas, then
            expand the Idea Card you want and click on the Edit or Delete button
            on the bottom.
          </p>
          ---add a screenshot from the "create idea button" and the edit/delete
          buttons---{' '}
        </div>
        <div>
          <h3>How to find old Hackathons?</h3>
          <p>
            If you are interested in Past Hackathons or want to find an old idea
            that you remember, you can use the Archive. In the Archive you will
            find a selection of all past hackathons with their submitted ideas.
          </p>
        </div>
        <div>
          <h3>How the Voting and the Hackathon itself will work?</h3>
          ---add explanation about the voting system--- ---add space for
          specific explanation?---
        </div>
      </div>
    </>
  )
}

export default Home
