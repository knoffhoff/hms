import { createStyles } from '@mantine/core'

const borderRadius = 15

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
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
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
