import {
  Paper,
  createStyles,
  Button,
  Title,
  Container,
  Image,
  Text,
} from '@mantine/core'
import { useMsal } from '@azure/msal-react'
import idealoIcon from '../assets/idealo-icon.png'
import { SwitchToggle } from '../components/ThemeSwitchToggle'
import React from 'react'

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundImage:
      theme.colorScheme === 'dark'
        ? 'url(https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2344&q=80)'
        : 'url(https://images.unsplash.com/photo-1597200381847-30ec200eeb9a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80)',
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))

const Login = () => {
  const { classes } = useStyles()
  const { instance } = useMsal()

  const login = async () => {
    await instance.loginRedirect()
  }

  return (
    <div className={classes.wrapper}>
      <Container size={420} pt={200}>
        <Paper withBorder shadow={'md'} radius={'md'} p={30}>
          <Title
            align="center"
            sx={(theme) => ({
              fontFamily: `Greycliff CF, ${theme.fontFamily}`,
              fontWeight: 900,
            })}
          >
            Welcome to idealo Hackweek!
          </Title>
          <Button fullWidth mt="xl" onClick={login} size={'md'} mb={30}>
            <Image src={idealoIcon} width={20} mr={10} radius={2} />
            Sign in with idealo SSO
          </Button>
          <SwitchToggle />
        </Paper>
      </Container>
    </div>
  )
}

export default Login
