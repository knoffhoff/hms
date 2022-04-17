/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';

class CategoryCreateRequest {
  title: string;
  description: string;
  hackathonId: Uuid;

  constructor(
      title: string,
      description: string,
      hackathonId: Uuid,
  ) {
    this.title = title;
    this.description = description;
    this.hackathonId = hackathonId;
  }

  static parse(body: string): CategoryCreateRequest {
    const json = JSON.parse(body);
    return new CategoryCreateRequest(
        json.title,
        json.description,
        json.hackathonId,
    );
  }
}

export default CategoryCreateRequest;
