var config = {
    plaforms : [
        {
            PLATFORM:'GITHUB',
            GITHUB_TOKEN:'<accessToken>',
            PRIVATE_KEY:'<privateKey>',
            PROVIDER:'<provider>',
            REPO_URL:'https://api.github.com/users/flensburger88/repos',
            CONTRACT_ADDRESS:'0xCeAADd95e319aAbF0FA31C910E14f6d9c314Db2B',
            SCAN_TASK_INTERVALL: 20000,
            VOTE_INTERVALL: 90
        }
    ]
};

config.plaforms[0].GITHUB_TOKEN = process.env.GITHUB_TOKEN || config.plaforms[0].GITHUB_TOKEN;
config.plaforms[0].PRIVATE_KEY = process.env.PRIVATE_KEY || config.plaforms[0].PRIVATE_KEY;
config.plaforms[0].PROVIDER = process.env.PROVIDER || config.plaforms[0].PROVIDER;

module.exports = config;