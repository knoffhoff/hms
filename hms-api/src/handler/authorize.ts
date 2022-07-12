import {verify} from 'jsonwebtoken';

const AZURE_AD_CLIENT_ID = process.env.AZURE_AD_CLIENT_ID;
const AZURE_AD_ISSUER = process.env.AZURE_AD_ISSUER;
const AZURE_AD_CLIENT_PUBLIC_KEY = process.env.AZURE_AD_CLIENT_PUBLIC_KEY;

const generatePolicy = (principalId, effect, resource) => {
  const authResponse: any = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument: any = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne: any = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

export function authorize(event, context, callback) {
  if (!event.authorizationToken) {
    return callback('Unauthorized');
  }

  const tokenParts = event.authorizationToken.split(' ');
  const tokenValue = tokenParts[1];

  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    return callback('Unauthorized');
  }
  const options = {
    audience: AZURE_AD_CLIENT_ID,
    issuer: AZURE_AD_ISSUER,
  };

  try {
    verify(
      tokenValue,
      AZURE_AD_CLIENT_PUBLIC_KEY,
      options,
      (verifyError, decoded) => {
        if (verifyError) {
          console.log(`Token invalid. ${verifyError}`);
          return callback('Unauthorized');
        }
        return callback(
          null,
          generatePolicy(decoded.sub, 'Allow', event.methodArn)
        );
      }
    );
  } catch (err) {
    return callback('Unauthorized');
  }
}
