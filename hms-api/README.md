[//]: # (Anytime that you do something and go "that wasn't in the documentation"...
 you should obviously update this or any other README, doc file, or comment in the code!)
# HMS API
[//]: # (TODO I feel like there is a good bit more "general" information we could include here)
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


## Testing
### Running Unit Tests
[//]: # (TODO need to add information about testing here likely add Jest and run tests using NPM)
**THIS SECTION IS INCOMPLETE AND NEEDS SOME WORK**

### Manual Testing with Serverless
Functions can be manually tested by invoking the function directly from the Serverless CLI.  Documentation for this call can be found [here](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke), however the call is a shell command similar to:

```shell
sls invoke local --function <function_name>
```

### Manual Testing with Jetbrains IDEs
[//]: # (TODO expand this section when the client.http file is fuller)
**THIS SECTION IS INCOMPLETE AND NEEDS SOME WORK**

To make HTTP requests to the HMS API while using a Jetbrains IDE you can make use of the [client.http](dev/client.http) file included in this repository.


## Deploying
The HMS API is deployed both locally and into "production" by using the Serverless framework.  When developing and testing the HMS API it should be deployed locally.  Documentation for deploying with Serverless can be found [here](https://www.serverless.com/framework/docs/providers/aws/cli-reference/deploy).

### In Production
[//]: # (TODO we will need some information about getting login credentials here eventually)
**THIS SECTION IS INCOMPLETE AND NEEDS SOME WORK**

```shell
sls deploy
```


### Locally
[//]: # (TODO Likely this section is a bit lacking and could include more about how this works)
**THIS SECTION IS INCOMPLETE AND NEEDS SOME WORK**

[//]: # (TODO currently this needs to be run twice... it is like Serverless doesn't wait for LocalStack to be running properly :shrug:)
In order to start up the LocalStack environment and deploy the HMS API locally you can run:
```shell
sls deploy --stage local
```
