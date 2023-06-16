import { createStyles, MantineSize, MantineTheme } from '@mantine/core'
import {
  blue3,
  HEADER_HOVER_COLOR_DARK,
  HEADER_HOVER_COLOR_LIGHT,
  orange3,
  TEXT_COLOR_WHITE,
} from './colors'

const borderRadius = 15
const headerItemBorder = borderRadius / 2
const applyTheme = (
  theme: MantineTheme,
  darkColor: string,
  lightColor: string
) =>
  theme.colorScheme === 'dark'
    ? theme.colors[darkColor]
    : theme.colors[lightColor]
const applyPadding = (theme: MantineTheme) => ({
  paddingLeft: theme.spacing.md,
  paddingRight: theme.spacing.md,
  paddingBottom: theme.spacing.md,
})
const applyFontSize = (theme: MantineTheme, size: MantineSize) => ({
  fontSize: theme.fontSizes[size],
  lineHeight: '1.5em',
})

export const styles = createStyles((theme) => ({
  presentationsCards: {
    backgroundColor: 'lightblue',
    borderRadius: borderRadius,
  },

  card: {
    backgroundColor: applyTheme(theme, 'dark[7]', 'white'),
    borderRadius: borderRadius,
  },

  noBorderSection: {
    ...applyPadding(theme),
    ...applyFontSize(theme, 'md'),
    fontWeight: 500,
  },

  borderSection: {
    ...applyPadding(theme),
    borderBottom: `1px solid ${applyTheme(theme, 'dark[4]', 'gray[3]')}`,
  },

  ideaCardHeader: {
    ...applyPadding(theme),
    paddingTop: theme.spacing.md,
    borderBottom: `1px solid ${applyTheme(theme, 'dark[4]', 'gray[3]')}`,
  },

  text: applyFontSize(theme, 'sm'),

  smallText: {
    ...applyFontSize(theme, 'xs'),
    color: theme.colors.gray[6],
  },

  presentationText: {
    ...applyFontSize(theme, 'md'),
    marginTop: '1vh',
  },

  title: {
    ...applyFontSize(theme, 'lg'),
    fontWeight: 600,
    marginTop: '1vh',
  },

  label: {
    ...applyFontSize(theme, 'md'),
    textTransform: 'uppercase',
    fontWeight: 700,
    marginTop: '1vh',
    color: theme.colors.gray[6],
  },

  linkLabel: {
    marginRight: 5,
  },

  link: {
    display: 'block',
    padding: '8px 12px',
    borderRadius: headerItemBorder,
    textDecoration: 'none',
    color: TEXT_COLOR_WHITE,
    ...applyFontSize(theme, 'sm'),
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'light'
          ? HEADER_HOVER_COLOR_LIGHT
          : HEADER_HOVER_COLOR_DARK,
    },
  },

  headerLinks: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  headerBurger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerHeadline: {
    color: TEXT_COLOR_WHITE,
    fontSize: 30,
  },

  borderAccordion: {
    border: '1px solid',
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    borderRadius: borderRadius,
    padding: 5,
  },

  container: {
    marginTop: 10,
    padding: 8,
    borderRadius: borderRadius,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.dark[0],
  },

  noBorderAccordion: {
    marginTop: '1vh',
    border: 'none',
  },

  stepperStep: {
    maxWidth: 175,
  },

  accordionList: {
    marginBottom: 30,
  },

  commentTitle: {
    fontWeight: 600,
  },
}))

export const loginStyles = createStyles((theme) => ({
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

export const heroHeaderStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingTop: 80,
    paddingBottom: 60,
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[7]
        : theme.colors.gray[1],
    borderRadius: '8px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',

    '@media (max-width: 755px)': {
      paddingTop: 40,
      paddingBottom: 30,
    },
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: 46,
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    '@media (max-width: 520px)': {
      fontSize: 32,
    },
  },

  smallerText: {
    textAlign: 'center',
    fontSize: 20,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    '@media (max-width: 520px)': {
      fontSize: 18,
    },
  },

  highlight: {
    color: theme.colorScheme === 'dark' ? orange3 : blue3,
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',

    '@media (max-width: 520px)': {
      flexDirection: 'column',
    },
  },

  centeredText: {
    textAlign: 'center',
    marginTop: '20px',
  },

  hackathonHighlight: {
    color: theme.colorScheme === 'dark' ? orange3 : blue3,
    cursor: 'pointer',
    textDecoration: 'underline',
  },

  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },

  buttonArea: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: theme.spacing.sm,
  },
}))
