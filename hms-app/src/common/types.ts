export enum HackathonDropdownMode {
  Archive = 'ARCHIVE',
  IdeaPortal = 'IDEA_PORTAL',
  Home = 'HOME',
  MyIdeas = 'MY_IDEAS',
  MoveModal = 'MOVE_MODAL',
}

export enum HackathonDetailsType {
  Header = 'HEADER',
  FullInfo = 'FULLINFO',
  Archive = 'ARCHIVE',
}

export enum IdeaCardType {
  Owner = 'OWNER',
  Admin = 'ADMIN',
  Voting = 'VOTING',
  AllIdeas = 'ALL_IDEAS',
  IdeaPortal = 'IDEA_PORTAL',
  Archive = 'ARCHIVE',
}

export enum IdeaFormType {
  New = 'NEW',
  Edit = 'EDIT',
}

export type HackathonPreview = {
  id: string
  title: string
  description?: string
  slug: string
  startDate: Date
  endDate: Date
  votingOpened: boolean
}

export type Hackathon = {
  id: string
  title: string
  description?: string
  slug: string
  startDate: Date
  endDate: Date
  participants?: ParticipantPreview[]
  categories?: CategoryPreview[]
  ideas?: IdeaPreview[]
  skills?: SkillPreview[]
  votingOpened: boolean
}

export type HackathonSerializable = {
  id: string
  title: string
  description?: string
  slug: string
  startDate: string
  endDate: string
  participants?: ParticipantPreview[]
  categories?: CategoryPreview[]
  ideas?: IdeaPreview[]
  votingOpened: boolean
}

export const parseHackathon = (json: any): Hackathon =>
  ({
    id: json.id,
    title: json.title,
    description: json.description,
    slug: json.slug,
    startDate: new Date(json.startDate),
    endDate: new Date(json.endDate),
    ideas: json.ideas ? parseIdeaPreviews(json.ideas) : [],
    categories: json.categories ? parseCategoryPreviews(json.categories) : [],
    participants: json.participants
      ? parseParticipantPreviews(json.participants)
      : [],
    votingOpened: json.votingOpened,
  } as Hackathon)

export const parseHackathonPreview = (json: any): HackathonPreview =>
  ({
    id: json.id,
    title: json.title,
    description: json.description,
    slug: json.slug,
    startDate: new Date(json.startDate),
    endDate: new Date(json.endDate),
    votingOpened: json.votingOpened,
  } as HackathonPreview)

export const parseHackathonPreviews = (jsonArray: any[]): HackathonPreview[] =>
  jsonArray.map((json) => parseHackathonPreview(json))

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
  owner?: UserPreview
  hackathon?: HackathonPreview
  participants?: ParticipantPreview[]
  voters?: ParticipantPreview[]
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

export type IdeaComment = {
  id: string
  user: User
  ideaId: string
  text: string
  creationDate: Date
  parentIdeaCommentId?: string
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
  lastName?: string
  firstName: string
  emailAddress: string
  roles: string[]
  skills: SkillPreview[]
  imageUrl?: string
  creationDate: Date
}

export type ActiveDirectoryUser = {
  id: string
  displayName: string
  givenName: string
  surname: string
  mail: string
  userPrincipalName: string
}

export type SkillPreview = {
  id: string
  name: string
}

export type Skill = {
  id: string
  name: string
  description: string
}
