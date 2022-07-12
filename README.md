# Hackathon Management System

## Authentication
To use authentication with Azure AD you need to do the following:

In `hms-api`
1. Copy `public_key-example` and rename it to `public_key`. Add your Azure AD application's public key to the `public_key` file.
2. Copy secrets-example.json and rename it to secrets.json. Add the respective Azure AD details to the `secrets.json` file.
3. In serverless.yml under `custom` make sure `useAzureAuth` is set to `true`.

In `hms-app`
1. 
