/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import HackathonPreviewResponse from './HackathonPreviewResponse';
import Hackathon from '../repository/domain/Hackathon';
import Category from '../repository/domain/Category';

class CategoryResponse {
  id: Uuid;
  title: string;
  description: string;
  hackathon: HackathonPreviewResponse;

  constructor(
    id: Uuid,
    title: string,
    description: string,
    hackathon: HackathonPreviewResponse,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.hackathon = hackathon;
  }

  static from = (category: Category, hackathon: Hackathon) =>
    new CategoryResponse(
      category.id,
      category.title,
      category.description,
      HackathonPreviewResponse.from(hackathon),
    );
}

export default CategoryResponse;
