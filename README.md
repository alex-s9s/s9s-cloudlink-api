# CloudLink API

An API to make requests to [CloudLink](https://github.com/simon-s9/s9s-cloudlink) service.

* [Documentation](https://cdn.rawgit.com/simon-s9/s9s-cloudlink-api/master/docs/index.html)
* [Installation](#installation)
* [Examples](#examples)

## Installation
```
npm install --save s9s-cloudlink-api
```

## Examples
```javascript
const CloudlinkApi = require('../api');
const api = new CloudlinkApi({
    cloud: 'aws',
    server: {
        host: '127.0.0.1',
        port: 3000
    },
    auth: {
        accessKeyId: '...',
        secretAccessKey: '...',
        region: 'eu-central-1'
    }
});

api
    .listInstances()
    .then((instances) => {
        console.log('resolve', instances);
    })
    .catch((error) => {
        console.log('reject', error);
    });
```
