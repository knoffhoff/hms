import {buildResponse} from '../../rest/responses';
import {getIdea} from '../../repository/idea-repository';
import IdeaResponse from '../../rest/IdeaResponse';
import {getUser} from '../../repository/user-repository';
import participantPreviewResponse from '../../rest/ParticipantPreviewResponse';
import ParticipantPreviewResponse from '../../rest/ParticipantPreviewResponse';
import {
  getParticipant,
  getParticipants,
} from '../../repository/participant-repository';
import {getHackathon} from '../../repository/hackathon-repository';
import HackathonPreviewResponse from '../../rest/HackathonPreviewResponse';
import SkillPreviewResponse from '../../rest/SkillPreviewResponse';
import {getSkills} from '../../repository/skill-repository';
import CategoryPreviewResponse from '../../rest/CategoryPreviewResponse';
import {getCategory} from '../../repository/category-repository';
import {usersFor} from '../../service/user-service';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const idea = await getIdea(event.pathParameters.id);

  if (idea) {
    const owner = await getParticipant(idea.ownerId);
    const participants = await getParticipants(idea.participantIds);
    const users = await usersFor(participants);
    const skills = await getSkills(idea.requiredSkills);
    const responseBody = new IdeaResponse(
        idea.id,
        participantPreviewResponse.from(owner, await getUser(owner.userId)),
        HackathonPreviewResponse.from(await getHackathon(idea.hackathonId)),
        ParticipantPreviewResponse.fromArray(participants, users),
        idea.title,
        idea.description,
        idea.problem,
        idea.goal,
        SkillPreviewResponse.fromArray(skills),
        CategoryPreviewResponse.from(await getCategory(idea.categoryId)),
        idea.creationDate,
    );

    callback(null, buildResponse(200, responseBody));
  } else {
    callback(null, buildResponse(404, {}));
  }
}
