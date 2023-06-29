import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import { Group, Text, useMantineTheme } from '@mantine/core'
import { Movie, Upload, X } from 'tabler-icons-react'
import React, { useContext } from 'react'
import { showNotification } from '@mantine/notifications'
import { FileRejection } from 'react-dropzone'
import { UploadLoadingContext } from './FinalVideoUploadModal'
import { CustomXIcon } from './NotificationIcons'

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
      icon: <CustomXIcon />,
      autoClose: 5000,
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
      style={{ margin: '0 auto', maxWidth: '600px' }}
    >
      <Group
        position='center'
        spacing='xl'
        style={{ minHeight: 170, pointerEvents: 'none' }}
      >
        <Dropzone.Accept>
          <Upload
            size={50}
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
            color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <Movie size={50} />
        </Dropzone.Idle>

        <div>
          <Text size='xl' inline>
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
