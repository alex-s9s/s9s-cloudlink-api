import CloudlinkApiError from './CloudlinkApiError';
import CloudlinkHttp from './CloudlinkHttp';

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
     * A list of supported cloud (Cloud providers) codes
     * @returns {string[]}
     */
    static get supportedClouds() {
        return [
            'aws',
            'digitalocean'
        ];
    }

    /**
     * CloudlinkApi constructor
     * @param {{}} config Configurations object (must include "auth" and "server" properties)
     * @throws {CloudlinkApiError}
     */
    constructor(config) {

        /* eslint max-statements: ["error", 20] */
        // noinspection JSValidateTypes

        this.config = config || {};
        if (!this.config.cloud) {
            throw new CloudlinkApiError(
                'Missing "cloud" definition in config'
            );
        }
        if (CloudlinkApi.supportedClouds.indexOf(this.config.cloud) === -1) {
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
     * @param {Array} [ids]
     * @returns {Promise}
     */
    listInstances(ids = []) {
        return CloudlinkHttp.request(this.config, 'listInstances', {ids});
    }

    /**
     * Adds a new instance (Virtual machine)
     * @returns {Promise}
     * @param {Array} names New instance/s names
     * @param {string} region Region to create the instance/s at
     * @param {string} image Image/ami to create the instance/s from
     * @param {number} disk Disk size in GB
     * @param {string} size Diskspace size
     * @param {string} sshKeys SSH key to deploy to the new instance/s
     * @param {number|string} [subnet] Subnet id
     */
    addInstance(names, region, image, disk, size, sshKeys, subnet) {
        return CloudlinkHttp.request(this.config, 'addInstance', {
            names,
            region,
            image,
            disk,
            size,
            subnet,
            sshKeys
        });
    }

    /**
     * Deletes an instance/list of instances
     * @param instanceIds
     * @returns {Promise}
     */
    deleteInstance(instanceIds) {
        return CloudlinkHttp.request(this.config, 'deleteInstance', {
            instanceIds
        });
    }

    /**
     * Returns the status of an instance (Virtual machine)
     * @param {string|number} instanceId The id of an instance
     * @returns {Promise}
     */
    getInstanceStatus(instanceId) {
        return CloudlinkHttp.request(this.config, 'getInstanceStatus', {
            instanceId
        });
    }

    /**
     * Returns a list of regions available on cloud provider
     * @returns {Promise}
     */
    listRegions() {
        return CloudlinkHttp.request(this.config, 'listRegions', {});
    }

    /**
     * Returns a list of sizes available on cloud provider
     * @returns {Promise}
     */
    listSizes() {
        return CloudlinkHttp.request(this.config, 'listSizes', {});
    }

    /**
     * Returns a list of distributions available on cloud provider
     * @param {{}} filters Filters object
     * @returns {Promise}
     */
    listDistributions(filters = {}) {
        return CloudlinkHttp.request(this.config, 'listDistributions', {
            filters
        });
    }

    /**
     * Returns a list of volumes (Virtual/disks)
     * @returns {Promise}
     */
    listVolumes() {
        return CloudlinkHttp.request(this.config, 'listVolumes', {});
    }

    /**
     * Returns a list of SSH keys registered on cloud provider
     * @returns {Promise}
     */
    listKeys() {
        return CloudlinkHttp.request(this.config, 'listKeys', {});
    }

    /**
     * Registers a new public key on cloud provider
     * @param {string} name Name of the new key
     * @param {string} publicKey Public key contents
     * @returns {Promise}
     */
    addKey(name, publicKey) {
        return CloudlinkHttp.request(this.config, 'addKey', {
            name,
            publicKey
        });
    }

    /**
     * Deletes a key from cloud provider
     * @param {string|number} id Key name/id
     * @returns {Promise}
     */
    deleteKey(id) {
        return CloudlinkHttp.request(this.config, 'deleteKey', {
            id
        });
    }

    /**
     * Returns a list of VPCs (Virtual private network)
     * @param {{}} filters Filters object
     * @param {Array} ids Ids list
     * @returns {Promise}
     */
    listVpcs(filters = {}, ids = []) {
        return CloudlinkHttp.request(this.config, 'listVpcs', {
            filters,
            ids
        });
    }

    /**
     * Creates a new VPC (Virtual private network)
     * @param cidr CIDR block, network range
     * @param tenancy Tenancy default/dedicated/host
     * @returns {Promise}
     */
    addVpc(cidr, tenancy) {
        return CloudlinkHttp.request(this.config, 'addVpc', {
            cidr,
            tenancy
        });
    }

    /**
     * Returns a list of subnets
     * @param ids
     * @param filters
     * @returns {Promise}
     */
    listSubNets(ids = [], filters = []) {
        return CloudlinkHttp.request(this.config, 'listSubNets', {
            ids,
            filters
        });
    }

    /**
     * Creates a new subnet within a VPC
     * @param cidr CIDR block, network range
     * @param vpcId VPC id
     * @returns {Promise}
     */
    addSubNet(cidr, vpcId) {
        return CloudlinkHttp.request(this.config, 'addSubNet', {
            cidr,
            vpcId
        });
    }

}
