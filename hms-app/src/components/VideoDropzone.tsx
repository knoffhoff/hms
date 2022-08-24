import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import { Group, Text, useMantineTheme } from '@mantine/core'
import { Photo, Upload, X } from 'tabler-icons-react'
import React, { useContext } from 'react'
import { showNotification } from '@mantine/notifications'
import { FileRejection } from 'react-dropzone'
import { UploadLoadingContext } from './FinalVideoUploadModal'

const MAX_FILE_SIZE = 1000 * 1024 ** 2 // 1GB

type IProps = {
  uploadVideo: (file: File) => void
}

export default function VideoDropzone({ uploadVideo }: IProps) {
  const theme = useMantineTheme()
  const isLoading = useContext(UploadLoadingContext)
  const onAcceptFiles = (files: File[]) => {
    uploadVideo(files[0])
  }

  const onRejectFiles = (files: FileRejection[]) => {
    showNotification({
      title: 'File rejected',
      message: 'Only video files in mp4 format are allowed',
      color: 'red',
    })
  }

  return (
    <Dropzone
      onDrop={onAcceptFiles}
      onReject={(files) => onRejectFiles(files)}
      maxSize={MAX_FILE_SIZE}
      multiple={false}
      accept={[MIME_TYPES.mp4]}
      radius={theme.radius.lg}
      loading={isLoading}
    >
      <Group
        position='center'
        spacing='xl'
        style={{ minHeight: 420, pointerEvents: 'none' }}
      >
        <Dropzone.Accept>
          <Upload
            size={50}
            stroke={'1.5'}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === 'dark' ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <X
            size={50}
            stroke={'1.5'}
            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <Photo size={50} stroke={'1.5'} />
        </Dropzone.Idle>

        <div>
          <Text size='xl' inline align={'center'}>
            Drag video here or click to select file
          </Text>
          <Text size='sm' color='dimmed' inline mt={7} align={'center'}>
            Attach only one mp4 file, the file should not exceed 1GB
          </Text>
        </div>
      </Group>
    </Dropzone>
  )
}
