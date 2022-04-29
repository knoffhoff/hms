import { Idea } from '../common/types'

const core_url = process.env.REACT_APP_CORE_URL

export const getIdeaDetails = (ideaID: string): Promise<Idea> => {
  return fetch(`${core_url}/idea/${ideaID}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}

export const deleteIdea = (ideaID: string) => {
  return fetch(`${core_url}/idea/${ideaID}`, {
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

export const createIdea = (
  idea: {
    ownerId: string
    hackathonId: string
    title: string
    description: string
    problem: string
    goal: string
  },
  skills: string[],
  categories: string[]
) => {
  return fetch(`${core_url}/idea`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ownerId: idea.ownerId,
      hackathonId: idea.hackathonId,
      title: idea.title,
      description: idea.description,
      problem: idea.problem,
      goal: idea.goal,
      requiredSkills: skills,
      categoryId: categories.toString(),
    }),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
