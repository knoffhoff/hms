import { Outlet } from 'react-router-dom'
import {
  AppShell,
  Container,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from '@mantine/core'
import HeaderMenu from '../components/HeaderMenu'
import { useLocalStorage } from '../common/localStorage'
import { useAppDispatch } from '../hooks'
import {
  mapHackathonToSerializable,
  setHackathonList,
  setNextHackathon,
} from '../common/redux/hackathonSlice'
import React, { useEffect } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import Login from './Login'

const USE_AUTH = process.env.REACT_APP_USE_AZURE_AUTH === 'true'

const menuLinks = [
  { link: '', label: 'Home' },
  {
    link: 'ideas',
    label: 'Idea Portal',
  },
  { link: 'your-ideas', label: 'Your Ideas' },
  {
    link: 'archive',
    label: 'Archive',
  },
  { link: 'voting', label: 'Voting' },
  {
    link: 'admin',
    label: 'Admin',
  },
]

const defaultColorSchemeLocalStorageKey = 'color-scheme'
const defaultColorScheme: ColorScheme = 'light'
const toggleColorScheme = (colorScheme: ColorScheme) =>
  colorScheme === 'dark' ? 'light' : 'dark'

const Layout = () => {
  const { instance } = useMsal()
  const dispatch = useAppDispatch()
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(
    defaultColorSchemeLocalStorageKey,
    defaultColorScheme
  )
  const isAuthenticated = useIsAuthenticated()

  useEffect(() => {
    const getHackathons = async () => {
      const hackathons = await getListOfHackathons(instance)
      dispatch(setHackathonList(hackathons.map(mapHackathonToSerializable)))

      const nextHackathon = hackathons.find((hackathon) => {
        return new Date(hackathon.startDate) > new Date()
      })

      if (nextHackathon)
        dispatch(setNextHackathon(mapHackathonToSerializable(nextHackathon)))
    }

    getHackathons()
  }, [])

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={() => setColorScheme(toggleColorScheme(colorScheme))}
    >
      <MantineProvider theme={{ colorScheme }} withGlobalStyles>
        {(isAuthenticated || !USE_AUTH) && (
          <AppShell
            header={<HeaderMenu links={menuLinks} />}
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
                minHeight: 'calc(100vh - 56px)',
              },
            })}
          >
            <Container size={'xl'} pt={50}>
              <Outlet />
            </Container>
          </AppShell>
        )}
        {(!isAuthenticated && USE_AUTH) && <Login />}
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default Layout
