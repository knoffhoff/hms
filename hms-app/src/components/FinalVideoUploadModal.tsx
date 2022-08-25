import { Idea } from '../common/types'
import {
  Modal,
  Button,
  Title,
  Text,
  Stack,
  Center,
  Collapse,
} from '@mantine/core'
import { createContext, useEffect, useState } from 'react'
import VideoDropzone from './VideoDropzone'
import {
  checkIfVideoExists,
  getPresignedUrl,
  uploadVideoToS3,
} from '../actions/IdeaActions'
import { useMsal } from '@azure/msal-react'
import { showNotification } from '@mantine/notifications'
import { useToggle } from '@mantine/hooks'

type IProps = {
  idea: Idea
}
export const UploadLoadingContext = createContext(false)
const VIDEO_URL = process.env.REACT_APP_PRESENTATION_MEDIA_URL

export default function FinalVideoUploadModal({ idea }: IProps) {
  const { instance } = useMsal()
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [previousOpen, toggle] = useToggle([false, true])

  const checkAsyncForVideo = async () => {
    const videoUrl = `${VIDEO_URL}/${idea.id}.mp4`
    const res = await checkIfVideoExists(videoUrl)
    if (res?.ok) setVideoUrl(videoUrl)
  }

  useEffect(() => {
    checkAsyncForVideo()
  }, [])

  const uploadVideo = async (file: File) => {
    const reader = new FileReader()
    reader.onabort = () => {
      console.log('file reading was aborted')
      setLoading(false)
    }
    reader.onerror = () => {
      console.log('file reading has failed')
      setLoading(false)
    }
    reader.onload = async () => {
      const binaryStr = reader.result
      const res = await getPresignedUrl(instance, idea.id, 'upload')
      const uploadRes = await uploadVideoToS3(res.signedUrl, idea.id, binaryStr)
      setLoading(false)

      if (uploadRes?.status === 200) {
        showNotification({
          title: 'Video uploaded',
          message: 'Your video has been uploaded',
          color: 'green',
        })
        setTimeout(() => {
          checkAsyncForVideo()
        }, 1000)
      } else {
        showNotification({
          title: 'Video upload failed',
          message: 'Your video has not been uploaded',
          color: 'red',
        })
      }
    }
    setLoading(true)
    reader.readAsArrayBuffer(file)
  }

  return (
    <>
      <UploadLoadingContext.Provider value={loading}>
        <Modal opened={opened} onClose={() => setOpened(false)} size={800}>
          <Title align={'center'} mb={20}>
            Video upload
          </Title>
          <Text
            align={'center'}
            style={{ maxWidth: 700, margin: 'auto', marginBottom: 50 }}
          >
            Here you can upload your final presentation video. If you want to
            update a previous one for this idea just upload it again. This will
            overwrite the previous one.
          </Text>
          <VideoDropzone uploadVideo={uploadVideo} />

          {videoUrl && (
            <>
              <Center>
                <Button onClick={() => toggle()} my={20}>
                  Show previously uploaded video
                </Button>
              </Center>

              <Collapse in={previousOpen}>
                <Stack>
                  <video width='600' controls style={{ margin: 'auto' }}>
                    <source src={videoUrl} type='video/mp4' />
                    Your browser does not support HTML video.
                  </video>
                </Stack>
              </Collapse>
            </>
          )}
        </Modal>

        <Button onClick={() => setOpened(true)} color={'green'}>
          Upload video
        </Button>
      </UploadLoadingContext.Provider>
    </>
  )
}
