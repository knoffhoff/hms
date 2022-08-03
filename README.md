# Hackathon Management System

## Authentication
To use authentication with Azure AD you need to do the following:

In `hms-api`
1. Copy `public_key-example` and rename it to `public_key`. Add your Azure AD application's public key to the `public_key` file. 
Please read more in section [Azure AD Public Key](#azure-ad-public-key) to find out more about how to get public key.
2. Copy secrets-example.json and rename it to secrets.json. Add the respective Azure AD details to the `secrets.json` file.
3. In serverless.yml under `provider` > `environment` make sure `AUTHORIZER_TYPE` is set to `ACTIVE_DIRECTORY`. If you want to use no authentication, set it to `ALWAYS_PASS`

In `hms-app`
1. Copy `.env-example` and rename it to `.env`. Add your Azure AD application's account ID and redirect URL.
2. Set `REACT_APP_USE_AZURE_AUTH` to `true` in `.env`.

### Azure AD Public Key

[This article](https://www.voitanos.io/blog/validating-azure-ad-generated-oauth-tokens) gives a good introduction to
how to attain public key.

In a nutshell: 
1. go to https://developer.microsoft.com/de-DE/graph/graph-explorer and login. 
2. find a JWT token in the localstorage, whose key is `clientInfo`. 
3. copy the JWT token to https://jwt.io/, and take the decoded `kid`. 
4. go to https://login.microsoftonline.com/common/discovery/keys, The `x5c`value for the `kid` in your JWT token is the public key.
