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
            'digitalocean',
            'gce'
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
     * @param {Array} [securityGroups] List of security groups ids
     * @param {number|string} [vpc] Vpc id/address to provision to
     * @param {Array} [tags] Tags list
     * @param {string} [sshUser] SSH user
     */
    addInstance(names, region, image, disk, size, sshKeys, subnet, securityGroups, vpc, tags, sshUser) {
        return CloudlinkHttp.request(this.config, 'addInstance', {
            names,
            region,
            image,
            disk,
            size,
            subnet,
            sshKeys,
            sshUser,
            securityGroups,
            vpc,
            tags
        });
    }

    /**
     * Deletes an instance/list of instances
     * @param instanceIds
     * @returns {Promise}
     */
    deleteInstance(instanceIds) {
        return CloudlinkHttp.request(this.config, 'deleteInstance', {
            ids: instanceIds
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
     * @param name Vpc name
     * @param cidr CIDR block, network range
     * @param tenancy Tenancy default/dedicated/host
     * @returns {Promise}
     */
    addVpc(name, cidr, tenancy) {
        return CloudlinkHttp.request(this.config, 'addVpc', {
            name,
            cidr,
            tenancy
        });
    }

    /**
     * Sets/adds vpc attribute
     * @param vpcId
     * @param attributes
     * @returns {Promise}
     */
    addVpcAttribute(vpcId, attributes) {
        return CloudlinkHttp.request(this.config, 'addVpcAttribute', {
            vpcId,
            attributes
        });
    }

    /**
     * Returns vpc attribute value
     * @param vpcId
     * @param attribute
     * @returns {Promise}
     */
    getVpcAttribute(vpcId, attribute) {
        return CloudlinkHttp.request(this.config, 'getVpcAttribute', {
            vpcId,
            attribute
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

    /**
     * Sets "assignPublicIp" property for a subNet
     * @param subNetId
     * @param assignPublicIp
     * @returns {Promise}
     */
    setSubNetAttribute(subNetId, assignPublicIp) {
        return CloudlinkHttp.request(this.config, 'setSubNetAttribute', {
            subNetId,
            assignPublicIp
        });
    }

    /**
     * Creates a new security group under a vpcId
     * @param vpcId
     * @param name
     * @param description
     * @returns {Promise}
     */
    addSecurityGroup(vpcId, name, description) {
        return CloudlinkHttp.request(this.config, 'addSecurityGroup', {
            vpcId,
            name,
            description
        });
    }

    /**
     * Creates a set of inbound security group rules
     * @param groupId
     * @param rules
     * @returns {Promise}
     */
    addSecurityGroupInboundRules(groupId, rules) {
        return CloudlinkHttp.request(this.config, 'addSecurityGroupInboundRules', {
            groupId,
            rules
        });
    }

    /**
     * Creates a set of outbound security group rules
     * @param groupId
     * @param rules
     * @returns {Promise}
     */
    addSecurityGroupOutboundRules(groupId, rules) {
        return CloudlinkHttp.request(this.config, 'addSecurityGroupOutboundRules', {
            groupId,
            rules
        });
    }

    /**
     * Creates a new internet gateway
     * @returns {Promise}
     */
    addInternetGateway() {
        return CloudlinkHttp.request(this.config, 'addInternetGateway', {});
    }

    /**
     * Attaches internet gateway to VPC
     * @param vpcId
     * @param gatewayId
     * @returns {Promise}
     */
    attachInternetGateway(vpcId, gatewayId) {
        return CloudlinkHttp.request(this.config, 'attachInternetGateway', {
            vpcId,
            gatewayId
        });
    }

    /**
     * Lists all routes tables, may apply filters
     * @param filters
     * @returns {Promise}
     */
    listRouteTables(filters) {
        return CloudlinkHttp.request(this.config, 'listRouteTables', {
            filters: filters || {}
        });
    }

    /**
     * Adds a new route to a routes table and links it to an Internet gateway
     * @param routesTableId
     * @param cidr
     * @param gatewayId
     * @returns {Promise}
     */
    addRoute(routesTableId, cidr, gatewayId) {
        return CloudlinkHttp.request(this.config, 'addRoute', {
            routesTableId,
            cidr,
            gatewayId
        });
    }

}
