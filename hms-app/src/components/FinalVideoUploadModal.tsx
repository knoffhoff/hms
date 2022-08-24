import { Idea } from '../common/types'
import { Modal, Button, Title } from '@mantine/core'
import { createContext, useState } from 'react'
import VideoDropzone from './VideoDropzone'
import { getPresignedUrl, uploadVideoToS3 } from '../actions/IdeaActions'
import { useMsal } from '@azure/msal-react'
import { showNotification } from '@mantine/notifications'

type IProps = {
  idea: Idea
}
export const UploadLoadingContext = createContext(false)

export default function FinalVideoUploadModal({ idea }: IProps) {
  const { instance } = useMsal()
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(false)

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
        <Modal opened={opened} onClose={() => setOpened(false)} fullScreen>
          <Title align={'center'} mb={100}>
            Upload final presentation video
          </Title>
          <VideoDropzone uploadVideo={uploadVideo} />
        </Modal>

        <Button onClick={() => setOpened(true)} color={'green'}>
          Upload video
        </Button>
      </UploadLoadingContext.Provider>
    </>
  )
}
