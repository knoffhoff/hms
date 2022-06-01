export enum HackathonDropdownMode {
  Archive = 'ARCHIVE',
  IdeaPortal = 'IDEA_PORTAL',
  Home = 'HOME',
  YourIdeas = 'YOUR_IDEAS',
}

export enum HackathonDetailsType {
  Header = 'HEADER',
  FullInfo = 'FULLINFO',
}

export type HackathonPreview = {
  id: string
  title: string
  startDate: Date
  endDate: Date
}

export type Hackathon = {
  id: string
  title: string
  startDate: Date
  endDate: Date
  participants?: ParticipantPreview[]
  categories?: CategoryPreview[]
  ideas?: IdeaPreview[]
}

export const parseHackathon = (json: any): Hackathon =>
  ({
    id: json.id,
    title: json.title,
    startDate: new Date(json.startDate),
    endDate: new Date(json.endDate),
    ideas: json.ideas ? parseIdeaPreviews(json.ideas) : [],
    categories: json.ideas ? parseCategoryPreviews(json.categories) : [],
    participants: json.ideas ? parseParticipantPreviews(json.participants) : [],
  } as Hackathon)

export const parseHackathons = (jsonArray: any[]): Hackathon[] =>
  jsonArray.map((json) => parseHackathon(json))

export type IdeaPreview = {
  id: string
  title: string
}

const parseIdeaPreviews = (jsonArray: any[]): IdeaPreview[] =>
  jsonArray.map(
    (json) =>
      ({
        id: json.id,
        title: json.title,
      } as IdeaPreview)
  )

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

const parseCategoryPreviews = (jsonArray: any[]): CategoryPreview[] =>
  jsonArray.map(
    (json) =>
      ({
        id: json.id,
        title: json.title,
      } as CategoryPreview)
  )

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

const parseParticipantPreviews = (jsonArray: any[]): ParticipantPreview[] =>
  jsonArray.map(
    (json) =>
      ({
        id: json.id,
        user: parseUserPreview(json.user),
      } as ParticipantPreview)
  )

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

const parseUserPreview = (json: any): UserPreview =>
  ({
    id: json.id,
    lastName: json.lastName,
    firstName: json.firstName,
    imageUrl: json.imageUrl,
  } as UserPreview)

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
