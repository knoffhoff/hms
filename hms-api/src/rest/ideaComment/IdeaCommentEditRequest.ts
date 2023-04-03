class IdeaCommentEditRequest {
  text: string

  constructor(text: string) {
    this.text = text
  }

  static parse(body: string): IdeaCommentEditRequest {
    const json = JSON.parse(body)
    return new IdeaCommentEditRequest(json.text)
  }
}

export default IdeaCommentEditRequest
