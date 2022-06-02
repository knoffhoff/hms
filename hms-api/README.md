[//]: # (Anytime that you do something and go "that wasn't in the documentation"...
 you should obviously update this or any other README, doc file, or comment in the code!)

# HMS API

The HMS API functions as the backend of the HMS System. It is meant to handle requests from the frontend and manages the
storage of data and executes any long-running operations.

## Application Information

The HMS API is meant to run in [AWS Cloud](https://aws.amazon.com/getting-started/?ref=docs_gateway) as a collection
of [Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) functions. These lambda functions are written in
the [TypeScript](https://www.typescriptlang.org/) language using [NPM](https://docs.npmjs.com/about-npm) as their
package manager. In order to make the setup of TypeScript transpiler easier a Serverless plugin
called [serverless-plugin-typescript](https://github.com/serverless/serverless-plugin-typescript) is used.

The storage for the HMS API is done using collection of [DynamoDB](https://aws.amazon.com/dynamodb/) tables.

The HMS API is modeled using a microservice style architecture. This allows for the HMS API to run using minimal
resources and scale effectively during periods of high load. This should allow for costs to remain low for those hosting
the HMS API.

The creation of the AWS stack and deploying of the HMS API is handled by
the [Serverless](https://www.serverless.com/framework/docs) framework.

### Running Locally

When running on the HMS API locally for development and testing purposes, the AWS resources are mocked
using the Plugins: [Serverless Offline](https://www.serverless.com/plugins/serverless-offline/) and [Serverless DynamoDB Local](https://www.serverless.com/plugins/serverless-dynamodb-local). This allows for
developers to work and test in a local environment without occurring any additional costs.

## Application Structure

The HMS-API is divided into three layers; [Handler](src/handler), [Service](src/service), [Repository](src/repository).
Requests come into the Handler layer, they are passed to the Service layer for processing and then storage and retrieval
of data is done in the Repository layer. Errors are thrown from within the Service and Repository layers and are handled
in the Handler layer by use of the [handler-wrapper](src/handler/handler-wrapper.ts).

## Getting Started

In order to develop for the HMS API one will need a number of tools and languages installed on their system:

| Tool       | Installation Instructions                                                     | Purpose                             |
|------------|-------------------------------------------------------------------------------|-------------------------------------|
| NVM        | https://github.com/nvm-sh/nvm#installing-and-updating                         | Installing and managing Node.js/NPM |
| Node.js    | https://github.com/nvm-sh/nvm#usage                                           | Writing code                        |
| NPM        | https://github.com/nvm-sh/nvm#usage                                           | Node package management             |
| Jest       | `npm install jest --global`                                                   | Running unit tests                  |
| Serverless | https://www.serverless.com/framework/docs/getting-started                     | Building and deploying code         |
| AWS CLI    | https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html | Making requests to AWS              |
| Java       | https://sdkman.io/                                                            | Installing DynamoDB Local           |

### First Time Setup

After all (or at least Node.js and NPM) of the tools have been installed, you will need to install all the required
Node.js packages. This can be accomplished by running the following from within the hms-api folder:

```shell
npm install
```
followed by:

```shell
sls dynamodb install
```

Anytime a package in [package.json](package.json) is added or updated this should be run again to
keep [package-lock.json](package-lock.json) and your development environment up to date.

## Testing

### Writing/Running Unit Tests

Unit tests are run written and orchestrated using the [Jest](https://jestjs.io/) framework. Unit tests are located in
the `__test__` folder and can be run from the root directory using the `jest` CLI command (Jest must be installed
globally by NPM for this to work).

To run all tests execute the following command:

```shell
npm test
```

To run a single test execute a shell command similar to:

```shell
jest <text_name> 
```

Full CLI documentation for Jest can be found [here](https://jestjs.io/docs/cli)

### Manual Testing with Serverless

Functions can be manually tested by invoking the function directly from the Serverless CLI. Documentation for this call
can be found [here](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke), however the call is a
shell command similar to:

```shell
sls invoke local --function <function_name>
```

### Manual Testing with Jetbrains IDEs

To make HTTP requests to the HMS API while using a Jetbrains IDE you can make use of the `xxx.http` files in
the [dev](dev) folder in this repository.


##### Mock Data

To facilitate manual testing of the HMS-App and HMS-API mock data can be loaded into the database. This migrating and
seeding the Database is performed automatically with sls offline and can be adjusted in serverless.yml.

## Deploying

The HMS API is deployed both locally and into "production" by using the Serverless framework. When developing and
testing the HMS API it should be deployed locally. Documentation for deploying with Serverless can be
found [here](https://www.serverless.com/framework/docs/providers/aws/cli-reference/deploy).

### In Production

[//]: # (TODO we will need some information about getting login credentials here eventually)
**THIS SECTION IS INCOMPLETE AND NEEDS SOME WORK**

### Locally

[//]: # (TODO Likely this section is a bit lacking and could include more about how this works)
**THIS SECTION IS INCOMPLETE AND NEEDS SOME WORK**

[//]: # (TODO currently this needs to be run twice... it is like Serverless doesn't wait for LocalStack to be running properly :shrug:)
In order to start up the HMS API locally you can run:

```shell
npm start
```
