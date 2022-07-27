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
import React, { useEffect, useState, createContext } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import { createUser, getUserDetails, getUserExists } from '../actions/UserActions';
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import Login from './Login'
import { PAGE_BACKGROUND_DARK, PAGE_BACKGROUND_LIGHT } from '../common/colors'
import { getProfile } from '../common/actionAuth'
import { ActiveDirectoryUser, UserPreview } from '../common/types';

const USE_AUTH = process.env.REACT_APP_USE_AZURE_AUTH === 'true'

const menuLinks = [
  { link: '', label: 'Home' },
  {
    link: 'ideas',
    label: 'Idea Portal',
  },
  { link: 'my-ideas', label: 'My Ideas' },
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

export const UserContext = createContext({} as UserPreview | undefined)
const defaultColorSchemeLocalStorageKey = 'color-scheme'
const defaultColorScheme: ColorScheme = 'light'
const toggleColorScheme = (colorScheme: ColorScheme) =>
  colorScheme === 'dark' ? 'light' : 'dark'

const Layout = () => {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const dispatch = useAppDispatch()
  const [user, setUser] = useState<UserPreview>()
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(
    defaultColorSchemeLocalStorageKey,
    defaultColorScheme
  )

  const userExistsInDb = async (user: ActiveDirectoryUser) => {
    try {
      const userExistsResponse = await getUserExists(instance, user)
      if (userExistsResponse) return userExistsResponse
    } catch (err) {
      console.log(err)
    }
  }

  const createUserInDb = async (user: ActiveDirectoryUser) => {
    try {
      const createUserResponse = await createUser(instance, user)
      return createUserResponse
    } catch (err) {
      console.log(err)
    }
  }

  const getDbUser = async (userId: string) => {
    try {
      const getUserResponse = await getUserDetails(instance, userId)
      return getUserResponse
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const getProfileDetails = async () => {
      let userId = ''
      const profile = await getProfile(instance)
      const userExists = await userExistsInDb(profile)
      if (!userExists.exists) {
        const userCreated = await createUserInDb(profile)
        if (userCreated) {
          userId = userCreated.id
        }
      } else {
        userId = userExists.id
      }
      const dbUser = await getDbUser(userId)
      setUser(dbUser)
    }
    if (isAuthenticated) {
      getProfileDetails()
    }
  }, [instance])

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
          <UserContext.Provider value={user}>
            <AppShell
              header={<HeaderMenu links={menuLinks} />}
              styles={(theme) => ({
                main: {
                  backgroundColor:
                    theme.colorScheme === 'light'
                      ? PAGE_BACKGROUND_LIGHT
                      : PAGE_BACKGROUND_DARK,
                  minHeight: 'calc(100vh - 56px)',
                },
              })}
            >
              <Container size={'xl'} pt={50}>
                <Outlet />
              </Container>
            </AppShell>
          </UserContext.Provider>
        )}
        {!isAuthenticated && USE_AUTH && <Login />}
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default Layout
