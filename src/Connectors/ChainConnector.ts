import Web3 from 'web3';
import ConstValues from '../Environment/ConstValues';
import { PullRequest } from '../Model/pullrequests.interface';
import { GithubConnector } from '../Connectors/GithubConnector';
import chalk from 'chalk';
import { Color } from '../Enum/Color';
import { Repository } from '../Model/repository.interface';
import { Cache } from './Cache';

export class ChainConnector {
    public account: any;
    private web3: any;
    private contract: any;
    private githubConnector: GithubConnector;

    public constructor() {
        this.web3 = new Web3(new Web3.providers.HttpProvider(ConstValues.provider));
        this.contract = new this.web3.eth.Contract(ConstValues.abi, ConstValues.contractAddress);
        this.account = this.web3.eth.accounts.privateKeyToAccount(ConstValues.privateKey);
        this.githubConnector = new GithubConnector();
    }

    public transferPullRequests(pqs: PullRequest[], cache: Cache): Promise<PullRequest[]> {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < pqs.length; i++) {
                if(!cache.pullRequestLinks.some(link => link == pqs[i].link)) {
                    this.createPullRequest(pqs[i]).then(_ => {
                        console.log(chalk[Color.success]("The pull request '" + pqs[i].title + "' was transfered!"));
                        cache.pullRequestLinks.push(pqs[i].link);
                    }).catch(async _ => {
                        console.log(chalk[Color.error]("The pull request '" + pqs[i].title + "' could not be transfered!"));
                        const exists = await this.contract.methods.getPollIndex(pqs[i].id, pqs[i].platform).call();
                        if(exists > 0) {
                            cache.pullRequestLinks.push(pqs[i].link);
                            console.log(chalk[Color.info]("The pull request '" + pqs[i].title + "' already exists, no action required!"));
                        }
                    });
                }
            }

            resolve(pqs);
        });
    }

    private async createPullRequest(pq: PullRequest): Promise<any> {
        console.log(chalk[Color.success]("Found a pull request " + pq.title + ", transfering to the chain."))
        let contractData = this.contract.methods.submitNewPoll(pq.link, pq.id, pq.platform, pq.title, pq.description, pq.voteend);
        const gasLimit = await contractData.estimateGas({ from: this.account['address'] });
        return this.genericBlockchainCall(contractData.encodeABI(), gasLimit);
    }

    public checkForFinishedPoll(): Promise<any> {
        console.log(chalk[Color.info]("Check if a finished poll can be transfered!"))
        return new Promise(async (resolve, reject) => {
            const index: number = await this.contract.methods.getNextVoteFinishedButUntransfered().call();
            if (index != 0) {
                const pollPure = await this.contract.methods.polls(index).call();
                const result: boolean = await this.contract.methods.getVotingResult(index).call();
                const poll: PullRequest = {
                    link: pollPure['pullRequestLink'], id: pollPure['pullRequestId'], platform: pollPure['hostingplatform'],
                    title: pollPure['title'], description: pollPure['description'], voteend: pollPure['voteEnd']
                }

                await this.handleMergeRequests(index, result, poll);
            } else {
                console.log(chalk[Color.info]("No pull request to merge or reject!"));
            }
            resolve("")
        })
    }

    private handleMergeRequests(index: number, merge: boolean, poll: PullRequest): Promise<any> {
        return new Promise((resolve, reject) => {
            if (merge) {
                this.githubConnector.handleMergePullRequest(poll).then(async res => {
                    console.log(chalk[Color.success]("Successfully merged the pull request '" + poll.title + "'"));
                    this.validateMergeResult(index, poll);
                    resolve();
                }).catch(err => {
                    console.log(chalk[Color.error]("Tryed unsuccessfully to merge the pull request '" + poll.title + "'"));
                    this.validateMergeResult(index, poll);
                    reject();
                });
            } else {
                this.githubConnector.handleRejectPulRequest(poll).then(async res => {
                    console.log(chalk[Color.success]("Successfully rejected the pull request '" + poll.title + "'"));
                    this.validateMergeResult(index, poll);
                    resolve();
                }).catch(err => {
                    console.log(chalk[Color.error]("Tryed unsuccessfully to reject the pull request '" + poll.title + "'"));
                    this.validateMergeResult(index, poll);
                    reject();
                });
            }
        })
    }

    private validateMergeResult(index: number, poll: PullRequest): Promise<any> {
        return new Promise((resolve, reject) => {
            this.applyVotingResult(index, poll).then(_ => {
                console.log(chalk[Color.success]("Successfully wrote the result of the pull request '" + poll.title + "' on the ethereum blockchain"));
                resolve();
            }).catch(err => {
                console.log(chalk[Color.error]("Run on an error while trying to write the result of the pull request '" + poll.title + "' on the ethereum blockchain"));
                resolve();
            });
        })
    }

    public async applyVotingResult(index: number, pq: PullRequest): Promise<any> {
        console.log(chalk[Color.success]("Marking pull request " + pq.title + " as apllied on chain."))
        let contractData = this.contract.methods.appliedOnHostingPlatform(index);
        const gasLimit = await contractData.estimateGas({ from: this.account['address'] });
        return this.genericBlockchainCall(contractData.encodeABI(), gasLimit);
    }

    private async genericBlockchainCall(contractData: any, gasLimit: number): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const Transaction = require('ethereumjs-tx').Transaction;
                const txCount = await this.web3.eth.getTransactionCount(this.account['address']);

                const txObject = {
                    nonce: this.web3.utils.toHex(txCount),
                    to: ConstValues.contractAddress,
                    gasLimit: this.web3.utils.toHex(gasLimit),
                    gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('11', 'gwei')),
                    data: contractData
                }

                // Sign the transaction
                const tx = new Transaction(txObject, { chain: 'kovan', hardfork: 'istanbul' })
                const pk = Buffer.from(ConstValues.privateKey, 'hex')
                tx.sign(pk)

                const serializedTx = tx.serialize()
                const raw = '0x' + serializedTx.toString('hex')

                // Broadcast the transaction
                const receipt = await this.web3.eth.sendSignedTransaction(raw);
                resolve(receipt);
            } catch (err) {
                reject(err);
            }
        });
    }
}