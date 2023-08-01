import path from 'path';
import { Submission } from '../models/Submission';
import { IStorageClient } from './abstract.client';
import fs from 'fs';
import { glob } from 'glob';

export class FileStorage implements IStorageClient {
  private _directory: string;
  private _fileCharset: BufferEncoding = 'utf-8';

  constructor() {
    this._directory = path.join(__dirname, 'submissions');
  }

  insert(submission: Submission): Promise<string> {
    const fileName =
      this._fileNameFromUrl(submission.targetUrl) +
      '_' +
      new Date().getTime() +
      '.json';

    return new Promise<string>((res, rej) => {
      fs.writeFile(
        path.join(this._directory, fileName),
        JSON.stringify(submission),
        { encoding: this._fileCharset },
        (err) => {
          if (err) {
            rej(err);
          }

          res(fileName);
        }
      );
    });
  }

  async get(targetUrl: string): Promise<Submission[]> {
    const fileNamePattern =
      this._fileNameFromUrl(targetUrl) + '_' + '*' + '.json';
    const submissions: Submission[] = [];
    const paths = await glob('**/submissions/' + fileNamePattern);
    for (const p of paths) {
      const fileData = fs.readFileSync(p, this._fileCharset);

      const parsedData = JSON.parse(fileData);
      submissions.push(parsedData);
    }

    return submissions;
  }

  private _fileNameFromUrl(targetUrl: string) {
    return targetUrl.replace(/[\W]/gi, '_');
  }
}
