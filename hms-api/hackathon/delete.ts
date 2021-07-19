'use strict'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.delete = (event, context, callback) => {

  const params = {
    TableName: 'hackathon',
    Key: {
      id: event.pathParameters.id
    }
  }

  // write the hackathon to the database
  dynamoDb.delete(params, (error, result) => {
      // handle potential errors
    if (error) {
      console.error(error)
      callback(new Error('Couldn\'t delete hackathon.'))
      return
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Credentials' : true
      },
      body: 'successfully deleted hackathon ' + event.pathParameters.id
    }
    callback(null, response)
})
}
