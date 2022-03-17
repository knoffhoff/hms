#!/bin/bash

# Check if the AWS CLI is in the PATH
found=$(which aws)
if [ -z "$found" ]; then
  echo "Please install the AWS CLI under your PATH: http://aws.amazon.com/cli/"
  exit 1
fi

# Check if jq is in the PATH
found=$(which jq)
if [ -z "$found" ]; then
  echo "Please install jq under your PATH: http://stedolan.github.io/jq/"
  exit 1
fi

echo "Sync www content with S3 bucket $1 begin..."
cd build
aws s3 sync . s3://$1 --cache-control max-age="10" --acl public-read --region eu-central-1
cd ..
echo "Sync www content with S3 bucket $1 end"
