# DemocraticOracle
The democratic oracle represents the project source code for the transfer oracle in the thesis 
Development of a blockchain based access control protocol for
GitHub repositories as Open-Source project.

The smart contract details are available at https://github.com/flensburger88/DemocraticVotes


# Deployment
For deploying the blockchain needs to be deployed.
The smart contract adress has to be configured in src/environment/ConstValues.ts

Additional in this file, the access configuration for the blockchain and the hosting platform need to be configured.
A sample configuration is available in the file (this is of cause not valid ;) )



```js
npm install

npm run start
```

after these two commands, the service should start up with some messages.

In case you see some error messages, the credentials you provided in the ConstValues file, might be wrong

