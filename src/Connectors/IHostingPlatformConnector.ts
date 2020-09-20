import { PullRequest } from "../Model/pullrequests.interface";

export interface IHostingPlatformConnector {

    handleMergePullRequest(pq: PullRequest): Promise<any>;

    handleRejectPulRequest(pq: PullRequest): Promise<any>;

}