import { get, put, RequestPromise, patch } from 'request-promise'
import ConstValues from '../Environment/ConstValues';
import { PullRequest } from '../Model/pullrequests.interface';
import { Repository } from '../Model/repository.interface';
import chalk from 'chalk';
import { Color } from '../Enum/Color';
import { IHostingPlatformConnector } from './IHostingPlatformConnector';


export class GithubConnector implements IHostingPlatformConnector{

    public constructor() {
        console.log(chalk[Color.success]("Github Token:  " + ConstValues.GITHUB_TOKEN));
    }

    public analyseRepositories(): Promise<Repository[]> {
        return new Promise((resolve, reject) => {
            this.buildRequest(ConstValues.REPO_URL).then(repos => {
                console.log(chalk[Color.info]('Watching ' + repos.length + ' repositories...'));
                const newRepos: Repository[] = [];

                repos.forEach((repo: any) => {
                    if (!repo['private']) {
                        newRepos.push({ name: repo['name'], pullRequests: [] })
                    }
                });

                resolve(newRepos);
            }).catch(err => console.log(err));
        });
    }

    public analyseRepositoryPQs(cachedRepos: Repository[]): Promise<Repository[]> {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < cachedRepos.length; i++) {
                const pqs = await this.getPullRequests(cachedRepos[i]['name']);
                for (let a = 0; a < pqs.length; a++) {
                    if (pqs[a]['state'] == "open") {
                        cachedRepos[i]['pullRequests'].push({
                            link: pqs[a]['html_url'], id: pqs[a]['id'] + "",
                            platform: "Github", title: pqs[a]['title'], description: pqs[a]['body'],
                            voteend: Math.round(Date.now() / 1000) + ConstValues.VOTE_INTERVALL
                        });
                    }
                }
            }
            resolve(cachedRepos);
        });
    }

    public async handleMergePullRequest(pq: PullRequest): Promise<any> {
        const parts = pq.link.split('/');
        const purePQ = await this.getPullRequest(parts[4], parts[6]);

        return new Promise((resolve, reject) => {
            this.mergePullRequest(pq.title, parts[4], parts[6], purePQ['head']['sha']).then(_ => resolve()).catch(_ => reject());
        });
    }

    public handleRejectPulRequest(pq: PullRequest): Promise<any> {
        const parts = pq.link.split('/');

        return new Promise((resolve, reject) => {
            this.rejectPullRequest(pq.title, parts[4], parts[6]).then(_ => resolve()).catch(_ => reject());
        });
    }

    private mergePullRequest(title: string, repo: string, id: string, sha: string): RequestPromise {
        console.log(chalk[Color.success]("Merging " + title + " from the repository " + repo));
        const options = this.getMergeOptions("https://api.github.com/repos/flensburger88/" + repo + "/pulls/" + id + "/merge", sha);
        return put(options);
    }

    private rejectPullRequest(title: string, repo: string, id: string): RequestPromise {
        console.log(chalk[Color.success]("Rejecting " + title + " from the repository " + repo));
        const options = this.getRejectOptions("https://api.github.com/repos/flensburger88/" + repo + "/pulls/" + id);
        return patch(options);
    }


    private getPullRequests(repo: string) {
        return this.buildRequest("https://api.github.com/repos/flensburger88/" + repo + "/pulls");
    }

    private getPullRequest(repo: string, id: string) {
        return this.buildRequest("https://api.github.com/repos/flensburger88/" + repo + "/pulls/" + id);
    }


    private buildRequest(url: string): RequestPromise {
        const options = this.getRequestOptions(url);
        return get(options);
    }


    private getRequestOptions(url: string): any {
        return {
            uri: url,
            headers: {
                "Authorization": "Bearer " + ConstValues.GITHUB_TOKEN,
                'User-Agent': 'request'
            },
            json: true
        }
    }

    private getMergeOptions(url: string, sha: string): any {
        return {
            uri: url,
            headers: {
                "Authorization": "Bearer " + ConstValues.GITHUB_TOKEN,
                'User-Agent': 'request'
            },
            body: {
                merged: true,
                message: "Pull request was merged by the access broker.",
                sha: sha
            },
            json: true
        }
    }

    private getRejectOptions(url: string): any {
        return {
            uri: url,
            headers: {
                "Authorization": "Bearer " + ConstValues.GITHUB_TOKEN,
                'User-Agent': 'request'
            },
            body: {
                "state": "closed"
            },
            json: true
        }
    }
}