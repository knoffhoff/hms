import { Dropzone, MIME_TYPES } from '@mantine/dropzone'
import { Group, Text, useMantineTheme } from '@mantine/core'
import { Photo, Upload, X } from 'tabler-icons-react'
import React from 'react'
import { showNotification } from '@mantine/notifications'
import { FileRejection } from 'react-dropzone'

export default function VideoDropzone() {
  const theme = useMantineTheme()
  const onAcceptFiles = (files: File[]) => {
    console.log(files)
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
      maxSize={500 * 1024 ** 2}
      multiple={false}
      accept={[MIME_TYPES.mp4]}
      radius={theme.radius.lg}
    >
      <Group
        position='center'
        spacing='xl'
        style={{ minHeight: 220, pointerEvents: 'none' }}
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
          <Text size='xl' inline>
            Drag video here or click to select file
          </Text>
          <Text size='sm' color='dimmed' inline mt={7}>
            Attach only one file, the file should not exceed 500mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  )
}
