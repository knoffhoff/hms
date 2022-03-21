# HMS API
The HMS API functions as the backend of the HMS System.  It is meant to handle requests from the frontend and manages the storage of data and executes any long-running operations.


## Application Information
The HMS API is meant to run in [AWS Cloud](https://aws.amazon.com/getting-started/?ref=docs_gateway) as a collection of [Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) functions.  These lambda functions are written in the [TypeScript](https://www.typescriptlang.org/) language using [NPM](https://docs.npmjs.com/about-npm) as their package manager.  The storage for the HMS API is done using collection of [DynamoDB](https://aws.amazon.com/dynamodb/) tables.

The HMS API is modeled using a microservice style architecture. This allows for the HMS API to run using minimal resources and scale effectively during periods of high load.  This should allow for costs to remain low for those hosting the HMS API.

The creation of the AWS stack and deploying of the HMS API is handled by the [Serverless](https://www.serverless.com/framework/docs) framework.


### Running Locally
When running on the HMS API locally for development and testing purposes, the AWS resources are mocked using [LocalStack](https://localstack.cloud/) inside of [Docker](https://docs.docker.com/get-started/).  This allows for developers to work and test in a realistic environment without occurring any additional costs.


## Getting started
In order to develop for the HMS API one will need a number of tools and languages installed on their system:

| Tool        | Installation Instructions                                                     | Purpose                             |
|-------------|-------------------------------------------------------------------------------|-------------------------------------|
| NVM         | https://github.com/nvm-sh/nvm#installing-and-updating                         | Installing and managing Node.js/NPM |
| Node.js     | https://github.com/nvm-sh/nvm#usage                                           | Writing code                        |
| NPM         | https://github.com/nvm-sh/nvm#usage                                           | Node package management             |
| Serverless  | https://www.serverless.com/framework/docs/getting-started                     | Building and deploying code         |
| Docker      | https://docs.docker.com/get-docker                                            | Running LocalStack                  |
| Python3/PIP | https://www.python.org/downloads                                              | Installing LocalStack               |
| Localstack  | https://github.com/localstack/localstack#installing                           | Mocking AWS resources               |
| AWS CLI     | https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html | Making requests to LocalStack/AWS   |


## Compiling
There isn't a way to do this currently but maybe SLS has a way to trigger only up to a certain step


## Deploying
### Deploying in Production
```sls deploy```


### Deploying Locally
```sls deploy --stage local```


## Development And Testing
- client.http (for intelliJ IDEA)
- calling a function with sls
