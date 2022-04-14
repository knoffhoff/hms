export type Hackathon = {
  id: string
  title: string
}

export type Idea = {
  id: string
  title: string
  description: string
  author?: User
  reason: string
  problem: string
  goal: string
  skills: string[]
  category: string
  participants: User[]
  aws: boolean
}

export type User = {
  name: string
  email?: string
  role?: string
  avatar?: string
}
