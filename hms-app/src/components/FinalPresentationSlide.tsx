import { Badge, Container, Center, Title, Alert } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Idea } from '../common/types'
import { checkIfVideoExists } from '../actions/IdeaActions'
import ReactPlayer from 'react-player'
import { AlertCircle } from 'tabler-icons-react'

type IProps = {
  idea: Idea
  classes: any
}

const VIDEO_URL = process.env.REACT_APP_PRESENTATION_MEDIA_URL

export default function FinalPresentationsSlide({ idea, classes }: IProps) {
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
        my={10}
        size={'md'}
        variant={'outline'}
      >
        {idea.category?.title}
      </Badge>
      <Title className={classes.title} mb={10}>
        {idea.title}
      </Title>
      <Container p={0} fluid>
        {videoUrl ? (
          <Center>
            <ReactPlayer url={videoUrl} controls />
          </Center>
        ) : (
          <Alert
            mt={20}
            icon={<AlertCircle size={16} />}
            title='No video provided!'
            color='red'
          >
            There is no video for this idea. The presenter needs to upload a
            video or present manually.
          </Alert>
        )}
      </Container>
    </Container>
  )
}
