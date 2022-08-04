#!/usr/bin/env bash
# inspiration taken from https://github.com/Scout24/is24-kaeufer-plus-profile-view/blob/main/prepare-local-env.sh

function replaceValueInFile() {
  sed -i.backup -e "s|${1}|${2}|g" "${3}"
  if [ -f "${3}.backup" ]
  then
    rm "${3}.backup"
  fi
}

scloud account login s24-hackweek AdminAccess --write

# hms-api/public_key

AZURE_AD_PUBLIC_KEY=$(aws ssm get-parameter --cli-input-json "{\"Name\":\"/config/azure-ad-public-key\"}" --with-decryption --query "Parameter"."Value" --output text)

ENV_PATH="hms-api/public_key"
cp "hms-api/public_key-example" "$ENV_PATH"

replaceValueInFile "%%PUBLIC_KEY%%" "${AZURE_AD_PUBLIC_KEY}" "$ENV_PATH"

# hms-api/secrets

AZURE_AD_CLIENT_ID=$(aws ssm get-parameter --cli-input-json "{\"Name\":\"/config/azure-ad-client-id\"}" --with-decryption --query "Parameter"."Value" --output text)
AZURE_AD_ISSUER=$(aws ssm get-parameter --cli-input-json "{\"Name\":\"/config/azure-ad-issuer\"}" --with-decryption --query "Parameter"."Value" --output text)

ENV_PATH="hms-api/secrets.json"
cp "hms-api/secrets-example.json" "$ENV_PATH"

replaceValueInFile "%%AZURE_AD_CLIENT_ID%%" "${AZURE_AD_CLIENT_ID}" "$ENV_PATH"
replaceValueInFile "%%AZURE_AD_ISSUER%%" "${AZURE_AD_ISSUER}" "$ENV_PATH"

# hms-app/.env

REACT_APP_CORE_URL=$(aws ssm get-parameter --cli-input-json "{\"Name\":\"/config/core-url\"}" --query "Parameter"."Value" --output text)
REACT_APP_AZURE_ACCOUNT_ID=$(aws ssm get-parameter --cli-input-json "{\"Name\":\"/config/azure-account-id\"}" --with-decryption --query "Parameter"."Value" --output text)
REACT_APP_AZURE_AUTHORITY=$(aws ssm get-parameter --cli-input-json "{\"Name\":\"/config/azure-authority\"}" --with-decryption --query "Parameter"."Value" --output text)
REACT_APP_AZURE_REDIRECT_URL=$(aws ssm get-parameter --cli-input-json "{\"Name\":\"/config/azure-redirect-url\"}" --query "Parameter"."Value" --output text)

ENV_PATH="hms-app/.env"
cp "hms-app/.env-example" "$ENV_PATH"

replaceValueInFile "%%REACT_APP_CORE_URL%%" "${REACT_APP_CORE_URL}" "$ENV_PATH"
replaceValueInFile "%%REACT_APP_AZURE_ACCOUNT_ID%%" "${REACT_APP_AZURE_ACCOUNT_ID}" "$ENV_PATH"
replaceValueInFile "%%REACT_APP_AZURE_AUTHORITY%%" "${REACT_APP_AZURE_AUTHORITY}" "$ENV_PATH"
replaceValueInFile "%%REACT_APP_AZURE_REDIRECT_URL%%" "${REACT_APP_AZURE_REDIRECT_URL}" "$ENV_PATH"
replaceValueInFile "%%REACT_APP_AZURE_CLIENT_ID%%" "${AZURE_AD_CLIENT_ID}" "$ENV_PATH"



