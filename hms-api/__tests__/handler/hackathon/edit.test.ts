import {edit} from '../../../src/handler/hackathon/edit';
import Uuid, {uuid} from '../../../src/util/Uuid';
import * as hackathonService from '../../../src/service/hackathon-service';
import HackathonEditResponse from '../../../src/rest/HackathonEditResponse';
import InvalidStateError from '../../../src/error/InvalidStateError';
import NotFoundError from '../../../src/error/NotFoundError';
import HackathonEditRequest from '../../../src/rest/HackathonEditRequest';

const mockEditHackathon = jest.fn();
jest
  .spyOn(hackathonService, 'editHackathon')
  .mockImplementation(mockEditHackathon);

describe('Edit Hackathon', () => {
  test('Happy Path', async () => {
    const title = 'New fancy title';
    const description = "Lorem ipsum dollar dollar bills y'all";
    const slug = 'new_fancy_title';
    const startDate = new Date();
    const endDate = new Date(new Date().getTime() + 10000);
    const id = uuid();
    const votingOpened = true;
    const callback = jest.fn();

    mockEditHackathon.mockImplementation(() => {});

    await edit(
      toEvent(title, description, slug, startDate, endDate, id, votingOpened),
      null,
      callback,
    );

    expect(mockEditHackathon).toHaveBeenCalledWith(
      id,
      title,
      description,
      slug,
      startDate,
      endDate,
      votingOpened,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new HackathonEditResponse(id)),
    });
  });

  test('Throws InvalidStateError', async () => {
    const title = 'New fancy title';
    const description = "Lorem ipsum dollar dollar bills y'all";
    const slug = 'new_fancy_title';
    const startDate = new Date();
    const endDate = new Date(new Date().getTime() + 10000);
    const id = uuid();
    const votingOpened = true;
    const callback = jest.fn();

    const errorMessage = 'Bad State!';
    mockEditHackathon.mockImplementation(() => {
      throw new InvalidStateError(errorMessage);
    });

    await edit(
      toEvent(title, description, slug, startDate, endDate, id, votingOpened),
      null,
      callback,
    );

    expect(mockEditHackathon).toHaveBeenCalledWith(
      id,
      title,
      description,
      slug,
      startDate,
      endDate,
      votingOpened,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: errorMessage}),
    });
  });

  test('Throws NotFoundError', async () => {
    const title = 'New fancy title';
    const description = "Lorem ipsum dollar dollar bills y'all";
    const slug = 'new_fancy_title';
    const startDate = new Date();
    const endDate = new Date(new Date().getTime() + 10000);
    const id = uuid();
    const votingOpened = false;
    const callback = jest.fn();

    const errorMessage = 'Where is it????';
    mockEditHackathon.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await edit(
      toEvent(title, description, slug, startDate, endDate, id, votingOpened),
      null,
      callback,
    );

    expect(mockEditHackathon).toHaveBeenCalledWith(
      id,
      title,
      description,
      slug,
      startDate,
      endDate,
      votingOpened,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: errorMessage}),
    });
  });

  test('Throws Error', async () => {
    const title = 'New fancy title';
    const description = "Lorem ipsum dollar dollar bills y'all";
    const slug = 'new_fancy_title';
    const startDate = new Date();
    const endDate = new Date(new Date().getTime() + 10000);
    const id = uuid();
    const votingOpened = true;
    const callback = jest.fn();

    const errorMessage = 'Boring old error';
    mockEditHackathon.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await edit(
      toEvent(title, description, slug, startDate, endDate, id, votingOpened),
      null,
      callback,
    );

    expect(mockEditHackathon).toHaveBeenCalledWith(
      id,
      title,
      description,
      slug,
      startDate,
      endDate,
      votingOpened,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: errorMessage}),
    });
  });
});

const toEvent = (
  title: string,
  description: string,
  slug: string,
  startDate: Date,
  endDate: Date,
  id: Uuid,
  votingOpened: boolean,
): object => ({
  body: JSON.stringify(
    new HackathonEditRequest(
      title,
      description,
      slug,
      startDate,
      endDate,
      votingOpened,
    ),
  ),
  pathParameters: {
    id: id,
  },
});
