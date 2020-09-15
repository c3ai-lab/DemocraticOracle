class ConstValues {
    public readonly gitHubToken: string = "Bearer e4a62c74363077e6fd6125ecf23067a892e3ac82";
    public readonly scanTaskIntervall: number = 20000;
    public readonly voteIntervall: number = 90;

    public readonly contractAddress: string = "0xCeAADd95e319aAbF0FA31C910E14f6d9c314Db2B";
    public readonly privateKey = "f1d57d756f7a47c3e70b740acf95b38611a26b81c7a0cff7de872ab306ae35d0";

    public readonly abi: any = require('./connection.json');
    public readonly provider: string = 'https://kovan.infura.io/v3/349064b180a64b74a9f432841c494b1f';

    public readonly repoUrl: string = "https://api.github.com/users/flensburger88/repos";
    public readonly cachePath: string = "src/Environment/"
    public readonly cacheName: string = "cachedData.json"
}

export default new ConstValues();