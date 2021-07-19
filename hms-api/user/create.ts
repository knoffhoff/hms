'use strict'

import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime()

  const data = JSON.parse(event.body)

  if (typeof data.email !== 'string') {
    console.error('Validation Failed')
    callback(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Credentials' : true
      },
      body: 'Couldn\'t create/update user.'
    })
    return
  }

  const params = {
    TableName: 'user',
    Item: {
      id: JSON.parse(data.id),
      email: data.email,
      name: data.name,
      auth_info: data.auth_info,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }

  // write the user to the database
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
      body: 'successfully created/updated user'
    }
    callback(null, response)
  })
}
