import { Badge, Container, Grid, Text, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Idea } from '../common/types'
import { checkIfVideoExists } from '../actions/IdeaActions'
import ReactPlayer from 'react-player'

type IProps = {
  idea: Idea
  classes: any
}

const VIDEO_URL = process.env.REACT_APP_PRESENTATION_MEDIA_URL

export default function FinalPresentations({ idea, classes }: IProps) {
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    async function checkAsyncForVideo() {
      // TODO change URL
      const videoUrl = `${VIDEO_URL}/${idea.id}.mp4`
      const res = await checkIfVideoExists(videoUrl)
      if (res?.ok) setVideoUrl(videoUrl)
    }

    checkAsyncForVideo()
  }, [])

  return (
    <Container key={idea.id} className={classes.idea} fluid>
      <Badge
        fullWidth={false}
        color={'gray'}
        my={20}
        size={'lg'}
        variant={'outline'}
      >
        {idea.category?.title}
      </Badge>
      <Title className={classes.title} mb={10}>
        {idea.title}
      </Title>
      <Title
        order={2}
        className={classes.name}
      >{`by ${idea.owner?.user.firstName} ${idea.owner?.user.lastName}`}</Title>
      {(videoUrl && (
        <ReactPlayer url={videoUrl} width={'100%'} height={'70%'} />
      )) || <Title>No video provided</Title>}
    </Container>
  )
}
