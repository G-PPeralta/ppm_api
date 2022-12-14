import { Injectable } from '@nestjs/common';
import { Credentials } from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';
import { S3UploadPayload } from './dto/s3upload.dto';

@Injectable()
export class S3Service {
  private s3 = new S3({
    endpoint: process.env.LINODE_ENDPOINT,
    region: process.env.LINODE_STORAGE_REGION,
    sslEnabled: true,
    s3ForcePathStyle: false,
    credentials: new Credentials({
      accessKeyId: process.env.LINODE_ACCESS_KEY,
      secretAccessKey: process.env.LINODE_SECRET_KEY,
    }),
  });

  async uploadFilesToObjectStorage(payload: S3UploadPayload): Promise<string> {
    const { base64data, path, fileName, fileType, extension } = payload;

    const params = {
      Bucket: process.env.LINODE_BUCKET,
      Key: `${path}/${fileName}.${extension}`,
      Body: Buffer.from(base64data, 'base64'),
      ACL: 'public-read',
      ContentType: `${fileType}/${extension}`,
    };

    const { Location } = await this.s3.upload(params).promise();
    return Location;
  }

  async deleteFileFromObjectStorage(url) {
    const Key = url.split(`${process.env.LINODE_ENDPOINT}/`)[1];
    const params = {
      Bucket: process.env.LINODE_BUCKET,
      Key,
    };

    return this.s3.deleteObject(params).promise();
  }
}
