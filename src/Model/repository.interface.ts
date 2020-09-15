import { PullRequest } from "./pullrequests.interface";

export interface Repository {
    name: string,
    pullRequests: PullRequest[]
}