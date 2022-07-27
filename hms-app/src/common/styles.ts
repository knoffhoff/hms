import { createStyles } from '@mantine/core'
import {
  HEADER_ACTIVE_COLOR_DARK,
  HEADER_ACTIVE_COLOR_LIGHT,
  HEADER_HOVER_COLOR_DARK,
  HEADER_HOVER_COLOR_LIGHT,
  TEXT_COLOR_DARK,
  TEXT_COLOR_LIGHT,
  TEXT_COLOR_WHITE,
} from './colors'

const borderRadius = 15
const headerItemBorder = borderRadius / 2

export const styles = createStyles((theme) => ({
  presentationsCards: {
    backgroundColor: 'lightblue',
    borderRadius: borderRadius,
  },

  card: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    borderRadius: borderRadius,
  },

  noBorderSection: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
  },

  borderSection: {
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },

  text: {
    fontSize: theme.fontSizes.sm,
    lineHeight: '1.5em',
  },

  presentationText: {
    fontSize: theme.fontSizes.md,
    marginTop: '1vh',
  },

  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 600,
    marginTop: '1vh',
  },

  label: {
    textTransform: 'uppercase',
    fontSize: theme.fontSizes.md,
    fontWeight: 700,
    marginTop: '1vh',
    color: theme.colors.gray[6],
  },

  linkLabel: {
    marginRight: 5,
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: headerItemBorder,
    textDecoration: 'none',
    color: TEXT_COLOR_WHITE,
    fontSize: theme.fontSizes.sm,
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
