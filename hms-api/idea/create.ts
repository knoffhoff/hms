'use strict'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime()

  const data = JSON.parse(event.body)

  if (typeof data.title !== 'string') {
    console.error('Validation Failed')
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Credentials' : true
      },
      body: 'Couldn\'t create/update idea.'
    })
    return
  }

  const params = {
    TableName: 'idea',
    Item: {
      id: data.id,
      title: data.title,
      owner: data.owner,
      members: data.members,
      problem_hypothesis: data.problem_hypothesis,
      benefit: data.benefit,
      people_needed: data.people_needed,
      communication_channel: data.communication_channel,
      git_repo: data.git_repo,
      pitch_video: data.pitch_video,
      final_video: data.final_video,
      enroll: data.enroll,
      category: data.category,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }

  // write the idea to the database
  dynamoDb.put(params,(error) => {
    // handle potential errors
    if (error) {
      console.error(error)
      callback(new Error(error))
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Credentials' : true
      },
      body: 'successfully created/updated idea'
    }
    callback(null, response)
  })
}
