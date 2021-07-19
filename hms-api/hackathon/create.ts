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
      body: 'Couldn\'t create/update hackathon.'
    })
    return
  }

  const params = {
    TableName: 'hackathon',
    Item: {
      id: data.id,
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      maxPitchTime: data.maxPitchTime,
      categories: data.categories,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }

  // write the hackathon to the database
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
      body: 'successfully created/updated hackathon'
    }
    callback(null, response)
  })
}
