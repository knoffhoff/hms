'use strict'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.list = (event, context, callback) => {
  const params = {
    TableName: 'hackathon'
  }

  // get all hackathons
  dynamoDb.scan(params, (error, result) => {
      // handle potential errors
    if (error) {
      console.error(error)
      callback(new Error('Couldn\'t get hackathons.'))
      return
    }
    // create a response
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Credentials' : true
      },
      body: JSON.stringify(result.Items)
    }
    callback(null, response)
  })
}
