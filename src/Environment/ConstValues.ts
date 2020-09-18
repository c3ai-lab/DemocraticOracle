const config = require('../../config');

class ConstValues {
    public readonly abi: any = require('./connection.json');

    public readonly PLATFORM: string = config.plaforms[0].PLATFORM;

    public readonly PRIVATE_KEY: string = config.plaforms[0].PRIVATE_KEY;
    public readonly CONTRACT_ADDRESS: string = config.plaforms[0].CONTRACT_ADDRESS;
    public readonly PROVIDER: string = config.plaforms[0].PROVIDER;

    public readonly GITHUB_TOKEN: string = config.plaforms[0].GITHUB_TOKEN;
    public readonly REPO_URL: string = config.plaforms[0].REPO_URL;

    public readonly SCAN_TASK_INTERVALL: number = config.plaforms[0].SCAN_TASK_INTERVALL;
    public readonly VOTE_INTERVALL: number = config.plaforms[0].VOTE_INTERVALL;

}

export default new ConstValues();