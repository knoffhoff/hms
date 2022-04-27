import { Idea } from '../common/types'

const api_id = process.env.API_ID

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
  ideaText: {
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
  console.log('ideaText2', ideaText)
  console.log('skills2', skills)
  console.log('categories2', categories)
  return fetch(
    `http://localhost:4566/restapis/${api_id}/local/_user_request_/idea`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ownerId: ideaText.ownerId,
        hackathonId: ideaText.hackathonId,
        title: ideaText.title,
        description: ideaText.description,
        problem: ideaText.problem,
        goal: ideaText.goal,
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
