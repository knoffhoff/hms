export type HackathonPreview = {
  id: string
  title: string
}

export type Hackathon = {
  errorHackathonData: boolean
  isLoadingHackathonData: boolean
  hackathonId: string
  title: string
  startDate: string
  endDate: string
  participants?: ParticipantPreview[]
  categories?: CategoryPreview[]
  ideas?: IdeaPreview[]
}

export type IdeaPreview = {
  id: string
  title: string
}

export type Idea = {
  errorIdeaData: boolean
  isLoadingIdeaData: boolean
  id: string
  owner?: OwnerPreview
  hackathon?: HackathonPreview
  participants?: ParticipantPreview[]
  title: string
  description: string
  problem: string
  goal: string
  requiredSkills?: SkillPreview[]
  category?: CategoryPreview
  creationDate: string
}

export type CategoryPreview = {
  id: string
  title: string
}

export type Category = {
  id: string
  title: string
  description: string
  hackathonId: string
}

export type ParticipantPreview = {
  id: string
  user: User
}

export type Participant = {
  userId: string
  hackathonId: string
  id: string
  creationDate: string
}

export type User = {
  id: string
  lastName?: string
  firstName?: string
  imageUrl?: string
}

export type SkillPreview = {
  id: string
  name: string
}

export type OwnerPreview = {
  id: string
  user: User
}
