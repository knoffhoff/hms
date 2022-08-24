/* eslint-disable require-jsdoc */

import {wrapHandler} from '../handler-wrapper';
import Uuid, {uuid} from '../../util/Uuid';
import IdeaEditRequest from '../../rest/IdeaEditRequest';
import {editIdea} from '../../service/idea-service';
import {buildResponse} from '../../rest/responses';
import IdeaEditResponse from '../../rest/IdeaEditResponse';
import {getClient} from '../../repository/s3';
import {S3Client} from '@aws-sdk/client-s3';
import {fileParser} from '../../repository/idea-repository';
import {upload} from '../../repository/s3';

const s3: S3Client = getClient();
const HMS_BUCKET_NAME = process.env.HMS_BUCKET_NAME || '';
const MAX_FILE_SIZE = 524288000; // 500MB
const MP4_MIME_TYPE = 'video/mp4';
const MIME_TYPES = [MP4_MIME_TYPE];

export async function createFinalVideo(event, context, callback) {
  await wrapHandler(async () => {
    try {
      const formData = await fileParser(event, MAX_FILE_SIZE);
      const file = formData.files[0];

      if (
        file.content.byteLength > MAX_FILE_SIZE ||
        !MIME_TYPES.includes(file.contentType)
      ) {
        throw new Error('File type not allowed');
      }

      const uid = uuid();
      const fileKey = `${uid}.mp4`;
      const uploadedFile = await upload(HMS_BUCKET_NAME, file.content, fileKey);

      if (uploadedFile['$metadata'].httpStatusCode !== 200) {
        throw new Error('File upload failed');
      }

      //TODO request payload limit

      callback(
        null,
        buildResponse(200, {
          message: `File uploaded: ${HMS_BUCKET_NAME}/${fileKey}`,
        }),
      );
    } catch (error) {
      callback(null, buildResponse(500, {message: error.message}));
    }
  }, callback);
}
