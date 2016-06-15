import CloudlinkApiError from './CloudlinkApiError';
import Promise from 'promise';

/**
 * CloudlinkHttp class
 */
export default class CloudlinkHttp {

    /**
     * Make an http request to the service
     * @param {{}} config Cloudlink configuration object
     * @param {string} method Method name to call
     * @param {{}} params Request parameters
     * @returns {Promise}
     */
    static request(config, method, params) {
        let http = null;
        let postData = params || {};
        if (config.server.secure) {
            http = require('https');
        } else {
            http = require('http');
        }
        postData.auth = config.auth || {};
        postData = JSON.stringify(postData);
        return new Promise((resolve, reject) => {
            const request = http.request(
                {
                    hostname: config.server.host,
                    port: config.server.port,
                    path: `/${config.cloud}/${method}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': postData.length
                    }
                },

                /**
                 * Handle response
                 * @param {{
                 *  setEncoding:function,
                 *  on:function
                 * }} response
                 */
                (response) => {
                    let data = '';
                    response.setEncoding('utf8');
                    response.on('data', (chunk) => {
                        data += chunk;
                    });
                    response.on('end', () => {
                        data = JSON.parse(data);
                        if (data.status) {
                            resolve(
                                data.data
                            );
                        } else {
                            reject(
                                new CloudlinkApiError(
                                    data.error || 'Unknown error'
                                )
                            );
                        }
                    });
                }
            );
            request.on('error', reject);
            request.write(postData);
            request.end();
        });
    }

}
