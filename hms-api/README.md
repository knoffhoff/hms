# HMS API

The HMS Serverless API is written in TypeScript. Its function is to store/update/retrieve the Hackathon data in a AWS DynamoDB.
TypeScript (ts) offers type safety which is helpful when working with the AWS SDK, which comes with ts definitions (d.ts)

## Get started

After cloning the project you need to install typescript to be able to compile the .ts files to .js

`npm install -g typescript`

Next you need to run the node module installation:

`npm i`

If you need to make further adjustments to eg. AWS region take a look into the *serverless.yaml*

## compiling

You can then run the compiler by running `tsc` in this directory. It will pull the settings from .tsconfig and extra @types
from package.json. The output .js files is what will be uploaded by serverless.

## deploying

For deployment you need to be logged in to AWS with scloud so that serverless knows who is deploying to where.
Just run `sls deploy` and you get a invoke URL to call your endpoints in case of success.

## local development

For development purposes it can be useful to invoke your function locally by the CLI command:

`sls invoke local -f FUNCTION_NAME`

Also you can invoke the deployed function the same way leaving out the local keyword:

`sls invoke -f FUNCTION_NAME`

For detailed debug information add a flag to the command:

`sls invoke local -f FUNCTION_NAME -e "SLS_DEBUG=*"`

For further commands refer to the serverless docs cli-reference at:
https://www.serverless.com/framework/docs/providers/aws/cli-reference
