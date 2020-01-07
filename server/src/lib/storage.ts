/*
 * AWS S3 interface
 */

// tslint:disable-next-line: import-name
import S3 from 'aws-sdk/clients/s3';
import fileType from 'file-type';

export type StorageParams = {
  accessKeyId: string,
  secretAccessKey: string,
  bucket: string,
};

export default class Storage {

  private s3: S3 | null = null;
  private static instances: Storage[] = [];
  private static instanceEqualityChecks: (keyof StorageParams)[] = ['accessKeyId', 'secretAccessKey', 'bucket'];

  constructor(private params: StorageParams) {
    const existingInstance = Storage.findInstance(params);
    if (existingInstance) return existingInstance;

    this.s3 = new S3({ accessKeyId: params.accessKeyId , secretAccessKey: params.secretAccessKey, computeChecksums: true });

    Storage.registerInstance(this);
  }

  private static findInstance(params: StorageParams): Storage | undefined {
    return this.instances.find(
      (instance: Storage): boolean => {
        return this.instanceEqualityChecks.every((param): boolean => instance.params[param] === params[param]);
      });
  }

  private static registerInstance(instance: Storage): void {
    this.instances.push(instance);
  }

  public upload64(data: string, key: string): Promise<{ key: string, url: string }> {
    const body = Buffer.from(data.replace(/^data:[\w.-]+\/[\w.-]+;base64,/, ''), 'base64');
    const type = fileType(body);
    if (!type) throw Error('Cannot get the file type/extension');

    return this.s3!.upload({ Bucket: this.params.bucket, Key: `${key}.${type.ext}`, ContentType: type.mime, Body: body }).promise()
      .then(({ Key: key, Location: url }) => ({ key, url }))
      .catch((err) => {
        throw Error('Failed to upload file');
      });
  }

  public delete(key: string): Promise<{ key: string }> {
    return this.s3!.deleteObject({ Bucket: this.params.bucket, Key: key }).promise()
      .then(() => ({ key }))
      .catch((err) => {
        throw Error('Failed to delete file');
      });
  }

}
