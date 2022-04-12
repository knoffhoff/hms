import User from '../src/repository/domain/User';
import {uuid, Uuid} from '../src/util/uuids';
import {Role} from '../src/repository/domain/Role';
import Skill from '../src/repository/domain/Skill';
import Participant from '../src/repository/domain/Participant';

export interface UserData {
  id: Uuid;
  lastName: string;
  firstName: string;
  emailAddress: string;
  roles: Role[];
  skills: Uuid[];
  imageUrl: string;
  creationDate: Date;
}

export const randomUser = () => makeUser({} as UserData);

export const makeUser = (
    {
      id = uuid(),
      lastName = 'Gruber',
      firstName = 'Hans',
      emailAddress = 'test@hms.api',
      roles = [Role.Participant],
      skills = [],
      imageUrl = 'https://hms.api/image.jpg',
      creationDate = new Date(),
    }: UserData): User => new User(
    lastName,
    firstName,
    emailAddress,
    roles,
    skills,
    imageUrl,
    id,
    creationDate,
);

export interface ParticipantData {
  id: Uuid;
  userId: Uuid;
  hackathonId: Uuid;
  creationDate: Date;
}

export const makeParticipant = (
    {
      id = uuid(),
      userId = uuid(),
      hackathonId = uuid(),
      creationDate = new Date(),
    }: ParticipantData) => new Participant(
    userId,
    hackathonId,
    id,
    creationDate,
);

export interface SkillData {
  id: Uuid;
  name: string;
  description: string;
}

export const makeSkill = (
    {
      id = uuid,
      name = 'Testing',
      description = 'Just being wicked good at testing',
    }: SkillData): Skill => new Skill(name, description, id);
