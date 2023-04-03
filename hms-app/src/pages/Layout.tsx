import { Outlet } from 'react-router-dom'
import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  Container,
  MantineProvider,
} from '@mantine/core'
import HeaderMenu from '../components/HeaderMenu'
import { useLocalStorage } from '../common/localStorage'
import { useAppDispatch, useAppSelector } from '../hooks'
import {
  mapHackathonToSerializable,
  setHackathonList,
  setNextHackathon,
} from '../common/redux/hackathonSlice'
import React, { createContext, useEffect, useState } from 'react'
import { getListOfHackathons } from '../actions/HackathonActions'
import {
  createUser,
  getUserDetails,
  getUserExists,
} from '../actions/UserActions'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import Login from './Login'
import { PAGE_BACKGROUND_DARK, PAGE_BACKGROUND_LIGHT } from '../common/colors'
import { getProfile } from '../common/actionAuth'
import {
  ActiveDirectoryUser,
  HackathonPreview,
  UserPreview,
} from '../common/types'
import { setUserState, UserSerializable } from '../common/redux/userSlice'

const USE_AUTH = process.env.REACT_APP_USE_AZURE_AUTH === 'true'

export const UserContext = createContext({} as UserPreview | undefined)
export const CurrentHackathonContext = createContext(
  {} as HackathonPreview | undefined
)
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
  const [currentHackathon, setCurrentHackathon] = useState<HackathonPreview>()
  const stateUser = useAppSelector((state) => state.user.user)
  const [menuLinks, setMenuLinks] = useState<{ link: string; label: string }[]>(
    []
  )
  const [hackLinks, setHackLinks] = useState<{ link: string; label: string }[]>(
    []
  )
  const [adminLinks, setAdminLinks] = useState<
    { link: string; label: string }[]
  >([])
  const isAdmin = (user: UserSerializable) => {
    return user && user.roles && user.roles.includes('Admin')
  }

  useEffect(() => {
    if (isAuthenticated && stateUser) {
      setMenuLinks([
        { link: '', label: 'Home' },
        { link: 'ideation', label: 'Ideation Portal' },
      ])
      setHackLinks([
        {
          link: 'hackathons',
          label: 'All Ideas',
        },
        { link: 'my-ideas', label: 'My Ideas' },
        { link: 'archive', label: 'Archive' },
      ])

      if (isAdmin(stateUser)) {
        setHackLinks([
          {
            link: 'hackathons',
            label: 'All Ideas',
          },
          { link: 'my-ideas', label: 'My Ideas' },
          { link: 'archive', label: 'Archive' },
          { link: 'voting', label: 'Voting' },
        ])
        setAdminLinks([{ link: 'admin', label: 'Admin' }])
      }
    }
  }, [stateUser])

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
      dispatch(setUserState(dbUser))
    }
    if (isAuthenticated) {
      getProfileDetails()
    }
  }, [instance, isAuthenticated])

  useEffect(() => {
    const getHackathons = async () => {
      const hackathons = await getListOfHackathons(instance)
      dispatch(setHackathonList(hackathons.map(mapHackathonToSerializable)))

      const today = new Date()
      const nextHackathon = hackathons.find((hackathon) => {
        return new Date(hackathon.startDate) > today
      })

      const current = hackathons.find((hackathon) => {
        const endDatePlus1 = new Date(hackathon.endDate)
        endDatePlus1.setDate(endDatePlus1.getDate() + 1)
        return new Date(hackathon.startDate) <= today && endDatePlus1 >= today
      })
      setCurrentHackathon(current)

      if (nextHackathon)
        dispatch(setNextHackathon(mapHackathonToSerializable(nextHackathon)))
    }

    getHackathons()
  }, [instance, isAuthenticated])

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={() => setColorScheme(toggleColorScheme(colorScheme))}
    >
      <MantineProvider theme={{ colorScheme }} withGlobalStyles>
        {((isAuthenticated && user !== undefined) || !USE_AUTH) && (
          <UserContext.Provider value={user}>
            <CurrentHackathonContext.Provider value={currentHackathon}>
              <AppShell
                header={
                  <HeaderMenu
                    links={menuLinks}
                    hackathonLinks={hackLinks}
                    adminLinks={adminLinks}
                  />
                }
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
                <Container size={'xl'} pt={50} pb={100}>
                  <Outlet />
                </Container>
              </AppShell>
            </CurrentHackathonContext.Provider>
          </UserContext.Provider>
        )}
        {(!isAuthenticated || !user) && USE_AUTH && (
          <Login isAuthenticated={isAuthenticated} user={user} />
        )}
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default Layout
