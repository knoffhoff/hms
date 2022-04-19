export type HackathonPreview = {
  id: string
  title: string
}

export type IdeaPreview = {
  id: string
  title: string
}

export type Hackathon = {
  errorHackathonData: boolean
  isLoadingHackathonData: boolean
  title: string
  startDate: string
  endDate: string
  participants: ParticipantPreview[] | null
  categories: CategoryPreview | null
  ideas: IdeaPreview[] | null
}

export type Idea = {
  errorIdeaData: boolean
  isLoadingIdeaData: boolean
  id: string
  owner: OwnerPreview | null
  hackathon: HackathonPreview | null
  participants: ParticipantPreview[] | null
  title: string
  description: string
  problem: string
  goal: string
  requiredSkills: SkillPreview[]
  category: CategoryPreview | null
  creationDate: string
}

export type CategoryPreview = {
  id: string
  title: string
}

export type SkillPreview = {
  id: string
  name: string
}

export type OwnerPreview = {
  id: string
  user: User
}

export type ParticipantPreview = {
  id: string
  user: User
}

export type User = {
  id: string
  lastName?: string
  firstName?: string
  imageUrl?: string
}
