import { Submission } from "../models/Submission";

export interface IStorageClient {
    insert(submission: Submission): Promise<string>;
    get(targetUrl: string): Promise<Submission[]>;
}