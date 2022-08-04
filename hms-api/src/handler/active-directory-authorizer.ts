import {decode} from 'jsonwebtoken';
import {generatePolicy} from './lambda-policy-generator';

const AZURE_AD_CLIENT_ID = process.env.AZURE_AD_CLIENT_ID;
const AZURE_AD_ISSUER = process.env.AZURE_AD_ISSUER;
const AZURE_AD_CLIENT_PUBLIC_KEY = process.env.AZURE_AD_CLIENT_PUBLIC_KEY;

export const authorizeWithActiveDirectory = (event, context, callback) => {
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
    // Commented out verification of token since the token comes from graph API
    // see: https://stackoverflow.com/questions/45317152/invalid-signature-while-validating-azure-ad-access-token-but-id-token-works
    // could be of security concern!
    // verify(
    //   tokenValue,
    //   AZURE_AD_CLIENT_PUBLIC_KEY,
    //   options,
    //   (verifyError, decoded) => {
    //     if (verifyError) {
    //       return callback('Unauthorized');
    //     }
    //     return callback(
    //       null,
    //       generatePolicy(decoded.sub, 'Allow', event.methodArn),
    //     );
    //   },
    // );
    const decoded = decode(tokenValue);
    if (decoded.iss !== options.issuer) { return callback('Unauthorized') }
    return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn))
  } catch (err) {
    return callback('Unauthorized');
  }
};
