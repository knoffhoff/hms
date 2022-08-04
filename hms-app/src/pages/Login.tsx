import {
  Paper,
  Button,
  Title,
  Container,
  Image,
  Loader,
  Center,
} from '@mantine/core'
import { useMsal } from '@azure/msal-react'
import scoutIcon from '../assets/immoscout24-icon.png'
import { SwitchToggle } from '../components/ThemeSwitchToggle'
import React from 'react'
import { loginStyles } from '../common/styles'
import { UserPreview } from '../common/types'

const Login = (props: {
  isAuthenticated: boolean
  user: UserPreview | undefined
}) => {
  const { classes } = loginStyles()
  const { instance } = useMsal()

  const login = async () => {
    await instance.loginRedirect()
  }

  return (
    <div className={classes.wrapper}>
      <Container size={420} pt={200}>
        <Paper withBorder shadow={'md'} radius={'md'} p={30}>
          <Title
            align='center'
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            Welcome to Immoscout24 Hackweek!
          </Title>
          {!props.isAuthenticated && (
            <Button fullWidth mt='xl' onClick={login} size={'md'} mb={30}>
              <Image src={scoutIcon} width={20} mr={10} radius={2} />
              Sign in with Scout24 SSO
            </Button>
          )}
          {props.isAuthenticated && !props.user && (
            <Center mt={'xl'}>
              <Loader />
            </Center>
          )}
          <SwitchToggle />
        </Paper>
      </Container>
    </div>
  )
}

export default Login
