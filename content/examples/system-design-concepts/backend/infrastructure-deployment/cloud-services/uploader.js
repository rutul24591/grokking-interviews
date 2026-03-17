const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({ region: 'us-east-1' });

async function upload() {
  const body = fs.readFileSync('artifact.zip');
  await client.send(new PutObjectCommand({
    Bucket: 'example-bucket',
    Key: 'artifact.zip',
    Body: body
  }));
}
upload();