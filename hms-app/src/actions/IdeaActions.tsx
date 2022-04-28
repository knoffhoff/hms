import { Idea } from '../common/types'

const api_id = process.env.REACT_APP_API_ID

export const getIdeaDetails = (ideaID: string): Promise<Idea> => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/idea/${ideaID}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
    .then((data) => {
      return data.json()
    })
    .catch((err) => console.log(err))
}

export const deleteIdea = (ideaID: string) => {
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/idea/${ideaID}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  )
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
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/idea`,
    {
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
    }
  )
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}
