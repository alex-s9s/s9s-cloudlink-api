const Promise = require('promise');

/**
 * List of supported cloud providers
 * @type {string[]}
 */
const supportedClouds = [
    'aws',
    'digitalocean'
];

/**
 * CloudlinkApiError class
 * @extends {Error}
 */
class CloudlinkApiError extends Error {
}

/**
 * Make an http request to the service
 * @param config
 * @param method
 * @param params
 * @returns {Promise}
 */
const httpRequest = (config, method, params) => {
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
};

/**
 * CloudlinkApi class
 * @property {{
 *  auth: object,
 *  cloud: string,
 *  server: {host:string,port:number,secure:boolean}
 * }} config
 */
export class CloudlinkApi {

    /**
     * CloudlinkApi constructor
     * @param {{}} config Configurations object (must include "auth" and "server" properties)
     * @throws {CloudlinkApiError}
     */
    constructor(config) {

        /* eslint max-statements: ["error", 20] */

        this.config = config || {};
        if (!this.config.cloud) {
            throw new CloudlinkApiError(
                'Missing "cloud" definition in config'
            );
        }
        if (supportedClouds.indexOf(this.config.cloud) === -1) {
            throw new CloudlinkApiError(
                `"${this.config.cloud}" is not a supported cloud provider`
            );
        }
        if (!this.config.server) {
            throw new CloudlinkApiError(
                'Missing "server" object in config'
            );
        }
        if (!this.config.server.host) {
            throw new CloudlinkApiError(
                'Messing "server.host" in config'
            );
        }
        if (!this.config.server.port) {
            this.config.server.port = 80;
        }
        if (!this.config.server.secure) {
            this.config.server.secure = false;
        }
        if (!this.config.auth) {
            throw new CloudlinkApiError(
                'Missing "auth" object in config'
            );
        }
    }

    /**
     * Returns a list of instances (Virtual machines)
     * @returns {Promise}
     */
    listInstances() {
        return httpRequest(this.config, 'listInstances', {});
    }

    /**
     * Adds a new instance (Virtual machine)
     * @returns {Promise}
     * @param {Array} names
     * @param {string} region
     * @param {string} image
     * @param {string} size
     * @param {string} sshKey
     */
    addInstance(names, region, image, size, sshKey) {
        return httpRequest(this.config, 'addInstance', {
            names,
            region,
            image,
            size,
            sshKey
        });
    }

    /**
     * Returns the status of an instance (Virtual machine)
     * @param {string|number} instanceId
     * @returns {Promise}
     */
    getInstanceStatus(instanceId) {
        return httpRequest(this.config, 'getInstanceStatus', {
            instanceId
        });
    }

    /**
     * Returns a list of regions available on cloud provider
     * @returns {Promise}
     */
    listRegions() {
        return httpRequest(this.config, 'listRegions', {});
    }

    /**
     * Returns a list of sizes available on cloud provider
     * @returns {Promise}
     */
    listSizes() {
        return httpRequest(this.config, 'listSizes', {});
    }

    /**
     * Returns a list of distributions available on cloud provider
     * @param {{}} filters
     * @returns {Promise}
     */
    listDistributions(filters = {}) {
        return httpRequest(this.config, 'listDistributions', {
            filters
        });
    }

    /**
     * Returns a list of volumes (Virtual/disks)
     * @returns {Promise}
     */
    listVolumes() {
        return httpRequest(this.config, 'listVolumes', {});
    }

    /**
     * Returns a list of SSH keys registered on cloud provider
     * @returns {Promise}
     */
    listKeys() {
        return httpRequest(this.config, 'listKeys', {});
    }

    /**
     * Registers a new public key on cloud provider
     * @param {string} name
     * @param {string} publicKey
     * @returns {Promise}
     */
    addKey(name, publicKey) {
        return httpRequest(this.config, 'addKey', {
            name,
            publicKey
        });
    }

    /**
     * Deletes a key from cloud provider
     * @param {string|number} id
     * @returns {Promise}
     */
    deleteKey(id) {
        return httpRequest(this.config, 'deleteKey', {
            id
        });
    }

    /**
     * Returns a list of VPCs (Virtual private network)
     * @param {{}} filters
     * @param {Array} ids
     * @returns {Promise}
     */
    listVpcs(filters = {}, ids = []) {
        return httpRequest(this.config, 'listVpcs', {
            filters,
            ids
        });
    }

    /**
     * Creates a new VPC (Virtual private network)
     * @param cidr
     * @param tenancy
     * @returns {Promise}
     */
    addVpc(cidr, tenancy) {
        return httpRequest(this.config, 'addVpc', {
            cidr,
            tenancy
        });
    }

    /**
     * Returns a list of subnets
     * @returns {Promise}
     */
    listSubNets() {
        return httpRequest(this.config, 'listSubNets', {});
    }

    /**
     * Creates a new subnet within a VPC
     * @param cidr
     * @param vpcId
     * @returns {Promise}
     */
    addSubNet(cidr, vpcId) {
        return httpRequest(this.config, 'addSubNet', {
            cidr,
            vpcId
        });
    }

}
