import { mockPutItem } from '../repository/dynamo-db-mock'
import { randomHackathon } from '../repository/domain/hackathon-maker'
import {
  createHackathon,
  editHackathon,
  getHackathonListResponse,
  getHackathonResponse,
  removeHackathon,
} from '../../src/service/hackathon-service'
import { uuid } from '../../src/util/Uuid'
import { randomCategory } from '../repository/domain/category-maker'
import HackathonResponse from '../../src/rest/hackathon/HackathonResponse'
import { randomUser } from '../repository/domain/user-maker'
import { makeParticipant, ParticipantData, } from '../repository/domain/participant-maker'
import { randomIdea } from '../repository/domain/idea-maker'
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError'
import NotFoundError from '../../src/error/NotFoundError'
import HackathonListResponse from '../../src/rest/hackathon/HackathonListResponse'
import HackathonDeleteResponse from '../../src/rest/hackathon/HackathonDeleteResponse'
import Hackathon from '../../src/repository/domain/Hackathon'
import * as hackathonRepository from '../../src/repository/hackathon-repository'
import * as participantRepository from '../../src/repository/participant-repository'
import * as participantService from '../../src/service/participant-service'
import * as userRepository from '../../src/repository/user-repository'
import * as categoryRepository from '../../src/repository/category-repository'
import * as categoryService from '../../src/service/category-service'
import * as ideaRepository from '../../src/repository/idea-repository'
import * as ideaService from '../../src/service/idea-service'
import DeletionError from '../../src/error/DeletionError'
import ValidationError from '../../src/error/ValidationError'
import ValidationResult from '../../src/error/ValidationResult'
import InvalidStateError from '../../src/error/InvalidStateError'

const mockPutHackathon = jest
  .spyOn(hackathonRepository, 'putHackathon')
  .mockImplementation()
const mockGetHackathon = jest
  .spyOn(hackathonRepository, 'getHackathon')
  .mockImplementation()
const mockListHackathons = jest
  .spyOn(hackathonRepository, 'listHackathons')
  .mockImplementation()
const mockDeleteHackathon = jest
  .spyOn(hackathonRepository, 'deleteHackathon')
  .mockImplementation()

const mockListParticipants = jest
  .spyOn(participantRepository, 'listParticipants')
  .mockImplementation()
const mockRemoveParticipantsForHackathon = jest
  .spyOn(participantService, 'removeParticipantsForHackathon')
  .mockImplementation()

const mockGetUsers = jest
  .spyOn(userRepository, 'getUsers')
  .mockImplementation()

const mockCreateCategory = jest
  .spyOn(categoryService, 'createCategory')
  .mockImplementation()
const mockListCategories = jest
  .spyOn(categoryRepository, 'listCategories')
  .mockImplementation()
const mockRemoveCategoriesForHackathon = jest
  .spyOn(categoryService, 'removeCategoriesForHackathon')
  .mockImplementation()

const mockListIdeas = jest
  .spyOn(ideaRepository, 'listIdeasForHackathon')
  .mockImplementation()
const mockRemoveIdeasForHackathon = jest
  .spyOn(ideaService, 'removeIdeasForHackathon')
  .mockImplementation()

const mockSlugExists = jest
  .spyOn(hackathonRepository, 'hackathonSlugExists')
  .mockImplementation()

describe('Create Hackathon', () => {
  test('Happy Path', async () => {
    mockPutItem()

    const expected = randomHackathon()

    mockCreateCategory.mockResolvedValueOnce(randomCategory())

    const actual = await createHackathon(
      expected.title,
      expected.description,
      expected.slug,
      expected.startDate,
      expected.endDate,
    )

    expect(actual).toEqual(
      expect.objectContaining({
        title: expected.title,
        slug: expected.slug,
        startDate: expected.startDate,
        endDate: expected.endDate,
      }),
    )
    expect(mockPutHackathon).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expected.title,
        slug: expected.slug,
        startDate: expected.startDate,
        endDate: expected.endDate,
      }),
    )
    expect(mockCreateCategory).toHaveBeenCalledWith(
      'General',
      'General',
      actual.id,
    )
  })

  test('Validation Error', async () => {
    await expect(
      createHackathon('', 'descriiiiption', 'slug', new Date(), new Date()),
    ).rejects.toThrow(ValidationError)
  })

  test('Slug already exists', async () => {
    const expected = randomHackathon()

    mockSlugExists.mockResolvedValueOnce(true)

    await expect(
      createHackathon(
        expected.title,
        expected.description,
        expected.slug,
        expected.startDate,
        expected.endDate,
      ),
    ).rejects.toThrow(InvalidStateError)
    expect(mockPutHackathon).not.toHaveBeenCalled()
  })

  test('StartDate > EndDate', async () => {
    const expected = randomHackathon()

    await expect(
      createHackathon(
        expected.title,
        expected.description,
        expected.slug,
        expected.endDate,
        expected.startDate,
      ),
    ).rejects.toThrow(ValidationError)
    expect(mockPutHackathon).not.toHaveBeenCalled()
  })

  test('StartDate === EndDate', async () => {
    const expected = randomHackathon()

    await expect(
      createHackathon(
        expected.title,
        expected.description,
        expected.slug,
        expected.startDate,
        expected.startDate,
      ),
    ).rejects.toThrow(ValidationError)
    expect(mockPutHackathon).not.toHaveBeenCalled()
  })
})

describe('Edit Hackathon', () => {
  test('Happy Path', async () => {
    const oldHackathon = randomHackathon()
    const title = 'Worst Hackathon Ever'
    const description =
      'Lots of very, very, VERY important information ' +
      'about the hackathon and stuff'
    const slug = 'worst_hackathon_ever'
    const startDate = new Date('2000-01-01')
    const endDate = new Date('2000-04-04')
    const votingOpened = true
    const expected = new Hackathon(
      title,
      description,
      slug,
      startDate,
      endDate,
      oldHackathon.id,
      oldHackathon.creationDate,
      votingOpened,
    )

    mockGetHackathon.mockResolvedValueOnce(oldHackathon)

    await editHackathon(
      oldHackathon.id,
      title,
      description,
      slug,
      startDate,
      endDate,
      votingOpened,
    )

    expect(mockPutHackathon).toHaveBeenCalledWith(expected)
  })

  test('Validation Error', async () => {
    const failedValidation = new ValidationResult()
    failedValidation.addFailure('FAILURE')

    const mockHackathon = randomHackathon()
    jest.spyOn(mockHackathon, 'validate').mockReturnValue(failedValidation)
    mockGetHackathon.mockResolvedValueOnce(mockHackathon)

    await expect(
      editHackathon(
        uuid(),
        'tiiitle',
        'descriiiiption',
        'slug',
        new Date(),
        new Date(),
        true,
      ),
    ).rejects.toThrow(ValidationError)
  })

  test('StartDate > EndDate', async () => {
    const expected = randomHackathon()
    mockGetHackathon.mockResolvedValueOnce(expected)

    await expect(
      editHackathon(
        expected.id,
        expected.description,
        expected.title,
        expected.slug,
        expected.endDate,
        expected.startDate,
        expected.votingOpened,
      ),
    ).rejects.toThrow(ValidationError)
    expect(mockGetHackathon).toHaveBeenCalledWith(expected.id)
    expect(mockPutHackathon).not.toHaveBeenCalled()
  })

  test('StartDate === EndDate', async () => {
    const expected = randomHackathon()
    mockGetHackathon.mockResolvedValueOnce(expected)

    await expect(
      editHackathon(
        expected.id,
        expected.description,
        expected.title,
        expected.slug,
        expected.startDate,
        expected.startDate,
        expected.votingOpened,
      ),
    ).rejects.toThrow(ValidationError)
    expect(mockGetHackathon).toHaveBeenCalledWith(expected.id)
    expect(mockPutHackathon).not.toHaveBeenCalled()
  })

  test('Hackathon is missing', async () => {
    const id = uuid()

    mockGetHackathon.mockImplementation(() => {
      throw new Error('Uh oh')
    })

    await expect(
      editHackathon(
        id,
        'Anything',
        'A crappy description...',
        'slug',
        new Date(),
        new Date(new Date().getTime() + 10000),
        true,
      ),
    ).rejects.toThrow(NotFoundError)
    expect(mockPutHackathon).not.toHaveBeenCalled()
    expect(mockGetHackathon).toHaveBeenCalledWith(id)
  })
})

describe('Get Hackathon Response', () => {
  const id = uuid()
  const hackathon = randomHackathon()
  const user1 = randomUser()
  const participant1 = makeParticipant({ userId: user1.id } as ParticipantData)
  const user2 = randomUser()
  const participant2 = makeParticipant({ userId: user2.id } as ParticipantData)
  const category1 = randomCategory()
  const category2 = randomCategory()
  const idea1 = randomIdea()
  const idea2 = randomIdea()
  const idea3 = randomIdea()

  test('Happy Path', async () => {
    const expected = HackathonResponse.from(
      hackathon,
      [participant1, participant2],
      [user1, user2],
      [category1, category2],
      [idea1, idea2, idea3],
    )

    mockListParticipants.mockResolvedValueOnce([participant1, participant2])
    mockGetUsers.mockResolvedValueOnce([user1, user2])
    mockListCategories.mockResolvedValueOnce([category1, category2])
    mockListIdeas.mockResolvedValueOnce([idea1, idea2, idea3])
    mockGetHackathon.mockResolvedValueOnce(hackathon)

    expect(await getHackathonResponse(hackathon.id)).toStrictEqual(expected)
    expect(mockListParticipants).toHaveBeenCalledWith(hackathon.id)
    expect(mockGetUsers).toHaveBeenCalledWith([user1.id, user2.id])
    expect(mockListCategories).toHaveBeenCalledWith(hackathon.id)
    expect(mockListIdeas).toHaveBeenCalledWith(hackathon.id)
    expect(mockGetHackathon).toHaveBeenCalledWith(hackathon.id)
  })

  test('Missing Ideas', async () => {
    mockListParticipants.mockResolvedValueOnce([participant1, participant2])
    mockGetUsers.mockResolvedValueOnce([user1, user2])
    mockListCategories.mockResolvedValueOnce([
      randomCategory(),
      randomCategory(),
    ])
    mockListIdeas.mockImplementation(() => {
      throw new NotFoundError('Missing the things')
    })

    await expect(getHackathonResponse(id)).rejects.toThrow(
      ReferenceNotFoundError,
    )
    expect(mockListParticipants).toHaveBeenCalledWith(id)
    expect(mockGetUsers).toHaveBeenCalledWith([user1.id, user2.id])
    expect(mockListCategories).toHaveBeenCalledWith(id)
    expect(mockListIdeas).toHaveBeenCalledWith(id)
    expect(mockGetHackathon).not.toHaveBeenCalled()
  })

  test('Missing Categories', async () => {
    mockListParticipants.mockResolvedValueOnce([participant1, participant2])
    mockGetUsers.mockResolvedValueOnce([user1, user2])
    mockListCategories.mockImplementation(() => {
      throw new NotFoundError('Missing the things')
    })

    await expect(getHackathonResponse(id)).rejects.toThrow(
      ReferenceNotFoundError,
    )
    expect(mockListParticipants).toHaveBeenCalledWith(id)
    expect(mockGetUsers).toHaveBeenCalledWith([user1.id, user2.id])
    expect(mockListCategories).toHaveBeenCalledWith(id)
    expect(mockListIdeas).not.toHaveBeenCalled()
    expect(mockGetHackathon).not.toHaveBeenCalled()
  })

  test('Missing Users', async () => {
    mockListParticipants.mockResolvedValueOnce([participant1, participant2])
    mockGetUsers.mockImplementation(() => {
      throw new NotFoundError('Missing the things')
    })

    await expect(getHackathonResponse(id)).rejects.toThrow(
      ReferenceNotFoundError,
    )
    expect(mockListParticipants).toHaveBeenCalledWith(id)
    expect(mockGetUsers).toHaveBeenCalledWith([
      participant1.userId,
      participant2.userId,
    ])
    expect(mockListCategories).not.toHaveBeenCalled()
    expect(mockListIdeas).not.toHaveBeenCalled()
    expect(mockGetHackathon).not.toHaveBeenCalled()
  })

  test('Missing Participants', async () => {
    mockListParticipants.mockImplementation(() => {
      throw new NotFoundError('Missing the things')
    })

    await expect(getHackathonResponse(id)).rejects.toThrow(
      ReferenceNotFoundError,
    )
    expect(mockListParticipants).toHaveBeenCalledWith(id)
    expect(mockGetUsers).not.toHaveBeenCalled()
    expect(mockListCategories).not.toHaveBeenCalled()
    expect(mockListIdeas).not.toHaveBeenCalled()
    expect(mockGetHackathon).not.toHaveBeenCalled()
  })

  test('Missing Hackathon', async () => {
    mockListParticipants.mockResolvedValueOnce([participant1, participant2])
    mockGetUsers.mockResolvedValueOnce([user1, user2])
    mockListCategories.mockResolvedValueOnce([
      randomCategory(),
      randomCategory(),
    ])
    mockListIdeas.mockResolvedValueOnce([idea1, idea2, idea3])
    mockGetHackathon.mockImplementation(() => {
      throw new NotFoundError('Missing the things')
    })

    await expect(getHackathonResponse(id)).rejects.toThrow(NotFoundError)

    expect(mockGetHackathon).toHaveBeenCalledWith(id)
  })
})

describe('Get Hackathon List Response', () => {
  test('Happy Path', async () => {
    const hackathon1 = randomHackathon()
    const hackathon2 = randomHackathon()
    const hackathon3 = randomHackathon()
    const expected = HackathonListResponse.from([
      hackathon1,
      hackathon2,
      hackathon3,
    ])

    mockListHackathons.mockResolvedValueOnce([
      hackathon1,
      hackathon2,
      hackathon3,
    ])

    expect(await getHackathonListResponse()).toStrictEqual(expected)
    expect(mockListHackathons).toHaveBeenCalled()
  })

  test('Missing Hackathons', async () => {
    mockListHackathons.mockImplementation(() => {
      throw new NotFoundError('Missing the things')
    })

    await expect(getHackathonListResponse()).rejects.toThrow(NotFoundError)
    expect(mockListHackathons).toHaveBeenCalled()
  })
})

describe('Delete Hackathon', () => {
  test('Happy Path', async () => {
    const id = uuid()
    mockRemoveIdeasForHackathon.mockImplementation()
    mockRemoveCategoriesForHackathon.mockImplementation()
    mockRemoveParticipantsForHackathon.mockImplementation()

    expect(await removeHackathon(id)).toStrictEqual(
      new HackathonDeleteResponse(id),
    )
    expect(mockRemoveIdeasForHackathon).toHaveBeenCalledWith(id)
    expect(mockRemoveCategoriesForHackathon).toHaveBeenCalledWith(id)
    expect(mockRemoveParticipantsForHackathon).toHaveBeenCalledWith(id)
    expect(mockDeleteHackathon).toHaveBeenCalledWith(id)
  })

  test('Failed to remove Participants', async () => {
    const id = uuid()
    mockRemoveIdeasForHackathon.mockImplementation()
    mockRemoveCategoriesForHackathon.mockImplementation()
    mockRemoveParticipantsForHackathon.mockImplementation(() => {
      throw new DeletionError('Participants Failed')
    })

    await expect(removeHackathon(id)).rejects.toThrow(DeletionError)
    expect(mockRemoveIdeasForHackathon).toHaveBeenCalledWith(id)
    expect(mockRemoveCategoriesForHackathon).toHaveBeenCalledWith(id)
    expect(mockRemoveParticipantsForHackathon).toHaveBeenCalledWith(id)
    expect(mockDeleteHackathon).not.toHaveBeenCalled()
  })

  test('Failed to remove Participants', async () => {
    const id = uuid()
    mockRemoveIdeasForHackathon.mockImplementation()
    mockRemoveCategoriesForHackathon.mockImplementation(() => {
      throw new DeletionError('Categories Failed')
    })
    mockRemoveParticipantsForHackathon.mockImplementation()

    await expect(removeHackathon(id)).rejects.toThrow(DeletionError)
    expect(mockRemoveIdeasForHackathon).toHaveBeenCalledWith(id)
    expect(mockRemoveCategoriesForHackathon).toHaveBeenCalledWith(id)
    expect(mockRemoveParticipantsForHackathon).not.toHaveBeenCalled()
    expect(mockDeleteHackathon).not.toHaveBeenCalled()
  })

  test('Failed to remove Participants', async () => {
    const id = uuid()
    mockRemoveIdeasForHackathon.mockImplementation(() => {
      throw new DeletionError('Ideas Failed')
    })
    mockRemoveCategoriesForHackathon.mockImplementation()
    mockRemoveParticipantsForHackathon.mockImplementation()

    await expect(removeHackathon(id)).rejects.toThrow(DeletionError)
    expect(mockRemoveIdeasForHackathon).toHaveBeenCalledWith(id)
    expect(mockRemoveCategoriesForHackathon).not.toHaveBeenCalled()
    expect(mockRemoveParticipantsForHackathon).not.toHaveBeenCalled()
    expect(mockDeleteHackathon).not.toHaveBeenCalled()
  })
})
