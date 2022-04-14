export type HackathonPreview = {
  id: string
  title: string
}

export type IdeaPreviews = {
  id: string
  title: string
}

export type Idea = {
  id: string
  owner: Owner[]
  hackathon: HackathonPreview[]
  participants: Participant[]
  title: string
  description: string
  problem: string
  goal: string
  requiredSkills: Skill[]
  category: Category[]
  creationDate: string
}

export type Category = {
  id: string
  title: string
}

export type Skill = {
  id: string
  name: string
}

export type Owner = {
  id: string
  user: User[]
}

export type Participant = {
  id: string
  user: User[]
}

export type User = {
  id: string
  lastName?: string
  firstName?: string
  imageUrl?: string
}
