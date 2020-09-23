# DemocraticOracle
Since the development of the git protocol, the amount of open-source project increases year by year.
For supporting this, many hosting platforms exist, which allow string of a project master and collaborating with other developers.
But in all hosting platforms, the project depends on the behavior of the project owner.
He can decide to integrate source code sections without asking anyone about it, the same way as he can prevent others from performing changes in the project.
In the thesis "Development of a blockchain based access control protocol for GitHub repositories as Open-Source project" by Torben Ulrich , the question if it is possible to develop a protocol, which uses a decentralized access control for these centralized source code hosting platforms is discussed.
In consequence, a protocol is designed, which removes the power from a project owner and passes all code changing decisions into a community of developers.
The community, which can decide about the code changes is defined as an open group of developers, which can permanently change.
To reach this permission transfer a smart contract is implemented, that offers a democratic voting process.
The vote which is performed in the blockchain results in the decision of a pull request being merged.
By doing this, this smart contract allows transparent verifying of all changes that are performed on the source code of an open-source project.
Moreover, this permission transfer completely removes the project owner and therefore removes possibilities to bypass decisions which are met by the community.
The protocol is implemented against the gitHub API on an Ethereum blockchain and is shared here an open-source project itself.


The democratic oracle represents the project source code for the transfer oracle in that thesis 

The smart contract details are available at https://github.com/flensburger88/DemocraticVotes
The webView details are available at https://github.com/flensburger88/DemocraticWebView


# Deployment
For deploying the blockchain needs to be deployed and available.
The smart contract adress has to be configured in src/environment/ConstValues.ts

Additional in this file, the access configuration for the blockchain and the hosting platform need to be configured.
A sample configuration is available in the file (this is of cause not valid ;) )

To start the transfer oracle run 
```js
npm install

npm run start
```

after these two commands, the service should start up with some messages like "watching 4 repositories".

In case you see some error messages, the credentials you provided in the ConstValues file, might be wrong.
The details for the error can be taken from the error message itself

