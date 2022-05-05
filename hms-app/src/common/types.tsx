export type HackathonPreview = {
  id: string
  title: string
}

export type Hackathon = {
  id: string
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
  creationDate: Date
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
  user: UserPreview
}

export type Participant = {
  userId: string
  hackathonId: string
  id: string
  creationDate: Date
}

export type UserPreview = {
  id: string
  lastName?: string
  firstName?: string
  imageUrl?: string
}

export type User = {
  id: string
  lastName: string
  firstName: string
  emailAddress: string
  roles: string[]
  skills: SkillPreview[]
  imageUrl: string
  creationDate: Date
}

export type SkillPreview = {
  id: string
  name: string
}

export type OwnerPreview = {
  id: string
  user: UserPreview
}
