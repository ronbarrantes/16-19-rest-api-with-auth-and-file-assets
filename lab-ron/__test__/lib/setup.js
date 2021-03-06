'use strict';

process.env.PORT = 7000;
const faker = require('faker');
const awsSDKMock = require('aws-sdk-mock');

process.env.MONGODB_URI = 'mongodb://localhost/testing';
process.env.IMAGR_SECRET = 'ThisIsMySecretThingy';
process.env.CORS_ORIGIN = 'http://localhost:8080';
process.env.AWS_BUCKET = 'imagrproject';
process.env.AWS_ACCESS_KEY_ID = 'lol_id';
process.env.AWS_SECRET_ACCESS_KEY = 'lol_key';

awsSDKMock.mock('S3', 'upload', (params, callback) => {
  if (!params.Key || !params.Bucket || !params.Body || !params.ACL)
    return callback(new Error('AWS_USAGE_ERROR: key bucket acl and body required'));
  if (params.ACL !== 'public-read')
    return callback(new Error('AWS_USAGE_ERROR: ACL must be public-read '));
  if (params.AWS_BUCKET !== process.env.BUCKET)
    return callback(new Error('AWS_USAGE_ERROR: wrong bucket'));

  callback(null, { Location: faker.internet.url() });
});

awsSDKMock.mock('S3', 'deleteObject', (params, callback) => {
  if (!params.Key || !params.Bucket)
    return callback(new Error('AWS_USAGE_ERROR: key bucket required'));
  if (params.AWS_BUCKET !== process.env.BUCKET)
    return callback(new Error('AWS_USAGE_ERROR: wrong bucket'));
  callback(null, {});
});