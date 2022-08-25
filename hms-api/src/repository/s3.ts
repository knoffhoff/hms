/* eslint-disable require-jsdoc */

import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3';

export function getClient(): S3Client {
  return new S3Client({
    region: 'eu-central-1',
  });
}

export const upload = async (bucketName, file, fileKey) => {
  const s3 = getClient();
  const params = {
    Bucket: bucketName,
    Key: `presentation-media/${fileKey}`,
    Body: file,
    //ContentType: file.type,
  };
  //const command = new CreateMultipartUploadCommand(params);
  const command = new PutObjectCommand(params);
  return await s3.send(command);
};
