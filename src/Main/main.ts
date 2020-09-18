import { GithubConnector } from '../Connectors/GithubConnector';
import { ChainConnector } from '../Connectors/ChainConnector';
import ConstValues from '../Environment/ConstValues';
import { Repository } from '../Model/repository.interface';
import chalk from 'chalk';
import { Color } from '../Enum/Color';
import { Cache } from '../Connectors/Cache';

export class Main {

    private intervall: any;
    private cache: Cache;
    private githubConnector: GithubConnector;
    private chainConnector: ChainConnector;

    constructor() {
        console.log(chalk[Color.info]("Init access broker."))

        this.cache = new Cache();
        this.githubConnector = new GithubConnector();
        this.chainConnector = new ChainConnector();

        console.log(chalk[Color.info]('New pull request will be searched every ' + (ConstValues.SCAN_TASK_INTERVALL / 1000) + " seconds."));
        console.log(chalk[Color.info]('                             '));
        console.log(chalk[Color.info]('Starting scan task...'));
        this.startTimer();
    }

    private startTimer(): void {
        this.intervall = setInterval(async () => {
            
            this.githubConnector.analyseRepositories().then(repositories => {
                this.githubConnector.analyseRepositoryPQs(repositories).then(async moreRepos => {
                    this.interactWithBlockchain(moreRepos);                    
                    console.log(chalk[Color.info]('                             '));
                    console.log(chalk[Color.info]('Waiting for data from Github...'));
                });
            });
            
            await this.chainConnector.checkForFinishedPoll();
        }, ConstValues.SCAN_TASK_INTERVALL);
    }

    private async interactWithBlockchain(repositories: Repository[]) {
        for (let i = 0; i < repositories.length; i++) {
            // TODO: Mit link raussuschen
            repositories[i].pullRequests = await this.chainConnector.transferPullRequests(repositories[i].pullRequests, this.cache);
        }
    }
}