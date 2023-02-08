import logo from '../assets/idealo-logo.png'

// default "Date" when its null or undefined
export const NULL_DATE = new Date('1970-01-01')
// as the ideation portal hackathon has null date (1970-01-01) this date is chosen to be the minimum date for a hackathon
export const MIN_DATE = new Date('1971-01-01')
// for undefined future hackathons we set date to 2040 so max date is for checking if defined hackatons are before that date
export const MAX_DATE = new Date('2039-12-31')
export const LOGO = logo
