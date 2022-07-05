import {
  Hackathon,
  HackathonPreview,
  parseHackathon,
  parseHackathons,
  parseHackathonPreviews,
} from '../common/types'

const core_url = process.env.REACT_APP_CORE_URL

export const getListOfHackathons = (): Promise<HackathonPreview[]> => {
  return fetch(`${core_url}/hackathons`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((data) => data.json())
    .then((json) => parseHackathonPreviews(json.hackathons))
    .catch((err) => {
      console.log(err)
      throw err
    })
}

export const getHackathonDetails = (
  hackathonID: string
): Promise<Hackathon> => {
  return fetch(`${core_url}/hackathon/${hackathonID}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((data) => data.json())
    .then((json) => parseHackathon(json))
    .catch((err) => {
      console.log(err)
      throw err
    })
}

export const createHackathon = (
  title: string,
  DescriptionValue: string,
  startDate: Date,
  endDate: Date
) => {
  return fetch(`${core_url}/hackathon`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      description: DescriptionValue,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const editHackathon = (
  hackathonID: string,
  title: string,
  DescriptionValue: string,
  startDate: Date,
  endDate: Date
) => {
  return fetch(`${core_url}/hackathon/${hackathonID}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      description: DescriptionValue,
      startDate: startDate.toString(),
      endDate: endDate.toString(),
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const deleteHackathon = (hackathonID: string) => {
  return fetch(`${core_url}/hackathon/${hackathonID}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
