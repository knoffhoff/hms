# Hackathon Management System

## Authentication
To use authentication with Azure AD you need to do the following:

In `hms-api`
1. Copy `public_key-example` and rename it to `public_key`. Add your Azure AD application's public key to the `public_key` file.
2. Copy secrets-example.json and rename it to secrets.json. Add the respective Azure AD details to the `secrets.json` file.
3. In serverless.yml under `provider` > `environment` make sure `AUTHORIZER_TYPE` is set to `ACTIVE_DIRECTORY`. If you want to use no authentication, set it to `ALWAYS_PASS`

In `hms-app`
1. Copy `.env-example` and rename it to `.env`. Add your Azure AD application's account ID and redirect URL.
2. Set `REACT_APP_USE_AZURE_AUTH` to `true` in `.env`.
