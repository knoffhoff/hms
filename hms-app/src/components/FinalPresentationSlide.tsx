import { Badge, Container, Grid, Text, Title } from '@mantine/core'
import { ArrowNarrowRight } from 'tabler-icons-react'
import { dark2 } from '../common/colors'
import React from 'react'
import { Idea } from '../common/types'

type IProps = {
  idea: Idea
  classes: any
}

export default function FinalPresentations({ idea, classes }: IProps) {
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

      <video width={'100%'} height={'100%'} controls>
        <source
          src={
            'https://germanywestcentral1-mediap.svc.ms/transform/thumbnail?provider=spo&inputFormat=mp4&cs=fFNQTw&docid=https%3A%2F%2Fidealo-my.sharepoint.com%3A443%2F_api%2Fv2.0%2Fdrives%2Fb!_86jlbR34k2vSdWexKWx6jthw1ecHbJMp-EnfZLMUwAtocYEWGadSb2bZMQwkUAN%2Fitems%2F01KXIM567TULURAGHOYZDYTULWBJHTZJZU%3Fversion%3DPublished&access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvaWRlYWxvLW15LnNoYXJlcG9pbnQuY29tQDIxOTU2YjE5LWZlZDItNDRiNy05MGNmLWI2ZDI4MWMwYTQyYSIsImlzcyI6IjAwMDAwMDAzLTAwMDAtMGZmMS1jZTAwLTAwMDAwMDAwMDAwMCIsIm5iZiI6IjE2NjExNjk2MDAiLCJleHAiOiIxNjYxMTkxMjAwIiwiZW5kcG9pbnR1cmwiOiJvVjFIeXJGb2x2Um5iTDhkdTlCdGlmVXNXWnRQSUhSVjNHMlJwNnc4c1drPSIsImVuZHBvaW50dXJsTGVuZ3RoIjoiMTE2IiwiaXNsb29wYmFjayI6IlRydWUiLCJ2ZXIiOiJoYXNoZWRwcm9vZnRva2VuIiwic2l0ZWlkIjoiT1RWaE0yTmxabVl0TnpkaU5DMDBaR1V5TFdGbU5Ea3RaRFU1WldNMFlUVmlNV1ZoIiwic2lnbmluX3N0YXRlIjoiW1wia21zaVwiXSIsIm5hbWVpZCI6IjAjLmZ8bWVtYmVyc2hpcHxqYWtvYi5wYW50ZW5AaWRlYWxvLmRlIiwibmlpIjoibWljcm9zb2Z0LnNoYXJlcG9pbnQiLCJpc3VzZXIiOiJ0cnVlIiwiY2FjaGVrZXkiOiIwaC5mfG1lbWJlcnNoaXB8MTAwMzIwMDBkYWEzN2M2MUBsaXZlLmNvbSIsInNpZCI6IjRlMzAzM2VhLWI3MDktNGIzMS04ODAyLTgxZmExNWY5MjI2NyIsInR0IjoiMCIsInVzZVBlcnNpc3RlbnRDb29raWUiOiIzIiwiaXBhZGRyIjoiMTQ1LjI0My4xNjYuMTAifQ.S1IzdDF2YkhkeXhnWm4wTjAzY0xaRm1PdTlxSjJUVDN0clNaWm5Xa2Ruaz0&eTag=%22%7B10E9A2F3-EE18-47C6-89D1-760A4F3CA734%7D%2C2%22&encodeFailures=1&width=1024&height=1024&srcWidth=&srcHeight='
          }
          type={'video/mp4'}
        />
        Your browser does not support the video tag.
      </video>
    </Container>
  )
}
