'use strict'

import * as uuid from 'uuid'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: 'idea',
    Key: {
      id: event.pathParameters.id
    }
  }

  // get the idea by id
  dynamoDb.get(params, (error, result) => {
        // handle potential errors
    if (error) {
      console.error(error)
      callback(new Error('Couldn\'t get idea.'))
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Credentials' : true
      },
      body: JSON.stringify(result.Item)
    }
    callback(null, response)
  })
}
