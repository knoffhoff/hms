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

const menuLinks = [
  { link: 'home', label: 'Home' },
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

const colorSchemeLocalStorageKey = 'color-scheme'

const Layout = () => {

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>(colorSchemeLocalStorageKey, 'light');

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
    >
      <MantineProvider theme={{ colorScheme }} withGlobalStyles>
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
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default Layout
