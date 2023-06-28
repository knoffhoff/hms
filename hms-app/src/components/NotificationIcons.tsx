import React from 'react'
import { Check, X } from 'tabler-icons-react'
import { ThemeIcon } from '@mantine/core'

export const CustomCheckIcon = () => {
  return (
    <ThemeIcon radius='xl' size='lg' color='teal'>
      <Check />
    </ThemeIcon>
  )
}

export const CustomXIcon = () => {
  return (
    <ThemeIcon radius='xl' size='lg' color='red'>
      <X />
    </ThemeIcon>
  )
}