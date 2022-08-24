/* eslint-disable require-jsdoc */

import {wrapHandler} from '../handler-wrapper';
import Uuid from '../../util/Uuid';
import {buildResponse} from '../../rest/responses';
import {getClient} from '../../repository/s3';
import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

const s3: S3Client = getClient();
const HMS_BUCKET_NAME = process.env.HMS_BUCKET_NAME || '';
const MP4_MIME_TYPE = 'video/mp4';

export async function getDownloadUrl(event, context, callback) {
  // TODO create function
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    const s3 = getClient();
    const fileName = id + '.mp4';
    const bucketParams = {
      Bucket: HMS_BUCKET_NAME,
      Key: 'presentation-media/' + fileName,
      ContentType: MP4_MIME_TYPE,
    };

    try {
      const command = new GetObjectCommand(bucketParams);
      const signedUrl = await getSignedUrl(s3, command, {
        expiresIn: 3600,
      });
      callback(null, buildResponse(200, {signedUrl: signedUrl}));
    } catch (error) {
      callback(null, buildResponse(500, {message: error.message}));
    }
  }, callback);
}
