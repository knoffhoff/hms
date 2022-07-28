/* eslint-disable require-jsdoc */

class CategoryEditRequest {
  title: string;
  description: string;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }

  static parse(body: string): CategoryEditRequest {
    const json = JSON.parse(body);
    return new CategoryEditRequest(json.title, json.description);
  }
}

export default CategoryEditRequest;
