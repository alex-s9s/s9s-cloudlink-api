'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CloudlinkApi = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CloudlinkApiError = require('./CloudlinkApiError');

var _CloudlinkApiError2 = _interopRequireDefault(_CloudlinkApiError);

var _CloudlinkHttp = require('./CloudlinkHttp');

var _CloudlinkHttp2 = _interopRequireDefault(_CloudlinkHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * CloudlinkApi class
 * @property {{
 *  auth: object,
 *  cloud: string,
 *  server: {host:string,port:number,secure:boolean}
 * }} config
 */

var CloudlinkApi = exports.CloudlinkApi = function () {
    _createClass(CloudlinkApi, null, [{
        key: 'supportedClouds',


        /**
         * A list of supported cloud (Cloud providers) codes
         * @returns {string[]}
         */
        get: function get() {
            return ['aws', 'digitalocean'];
        }

        /**
         * CloudlinkApi constructor
         * @param {{}} config Configurations object (must include "auth" and "server" properties)
         * @throws {CloudlinkApiError}
         */

    }]);

    function CloudlinkApi(config) {
        _classCallCheck(this, CloudlinkApi);

        /* eslint max-statements: ["error", 20] */
        // noinspection JSValidateTypes

        this.config = config || {};
        if (!this.config.cloud) {
            throw new _CloudlinkApiError2.default('Missing "cloud" definition in config');
        }
        if (CloudlinkApi.supportedClouds.indexOf(this.config.cloud) === -1) {
            throw new _CloudlinkApiError2.default('"' + this.config.cloud + '" is not a supported cloud provider');
        }
        if (!this.config.server) {
            throw new _CloudlinkApiError2.default('Missing "server" object in config');
        }
        if (!this.config.server.host) {
            throw new _CloudlinkApiError2.default('Messing "server.host" in config');
        }
        if (!this.config.server.port) {
            this.config.server.port = 80;
        }
        if (!this.config.server.secure) {
            this.config.server.secure = false;
        }
        if (!this.config.auth) {
            throw new _CloudlinkApiError2.default('Missing "auth" object in config');
        }
    }

    /**
     * Returns a list of instances (Virtual machines)
     * @param {Array} [ids]
     * @returns {Promise}
     */


    _createClass(CloudlinkApi, [{
        key: 'listInstances',
        value: function listInstances() {
            var ids = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

            return _CloudlinkHttp2.default.request(this.config, 'listInstances', { ids: ids });
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
         */

    }, {
        key: 'addInstance',
        value: function addInstance(names, region, image, disk, size, sshKeys, subnet, securityGroups) {
            return _CloudlinkHttp2.default.request(this.config, 'addInstance', {
                names: names,
                region: region,
                image: image,
                disk: disk,
                size: size,
                subnet: subnet,
                sshKeys: sshKeys,
                securityGroups: securityGroups
            });
        }

        /**
         * Deletes an instance/list of instances
         * @param instanceIds
         * @returns {Promise}
         */

    }, {
        key: 'deleteInstance',
        value: function deleteInstance(instanceIds) {
            return _CloudlinkHttp2.default.request(this.config, 'deleteInstance', {
                ids: instanceIds
            });
        }

        /**
         * Returns the status of an instance (Virtual machine)
         * @param {string|number} instanceId The id of an instance
         * @returns {Promise}
         */

    }, {
        key: 'getInstanceStatus',
        value: function getInstanceStatus(instanceId) {
            return _CloudlinkHttp2.default.request(this.config, 'getInstanceStatus', {
                instanceId: instanceId
            });
        }

        /**
         * Returns a list of regions available on cloud provider
         * @returns {Promise}
         */

    }, {
        key: 'listRegions',
        value: function listRegions() {
            return _CloudlinkHttp2.default.request(this.config, 'listRegions', {});
        }

        /**
         * Returns a list of sizes available on cloud provider
         * @returns {Promise}
         */

    }, {
        key: 'listSizes',
        value: function listSizes() {
            return _CloudlinkHttp2.default.request(this.config, 'listSizes', {});
        }

        /**
         * Returns a list of distributions available on cloud provider
         * @param {{}} filters Filters object
         * @returns {Promise}
         */

    }, {
        key: 'listDistributions',
        value: function listDistributions() {
            var filters = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            return _CloudlinkHttp2.default.request(this.config, 'listDistributions', {
                filters: filters
            });
        }

        /**
         * Returns a list of volumes (Virtual/disks)
         * @returns {Promise}
         */

    }, {
        key: 'listVolumes',
        value: function listVolumes() {
            return _CloudlinkHttp2.default.request(this.config, 'listVolumes', {});
        }

        /**
         * Returns a list of SSH keys registered on cloud provider
         * @returns {Promise}
         */

    }, {
        key: 'listKeys',
        value: function listKeys() {
            return _CloudlinkHttp2.default.request(this.config, 'listKeys', {});
        }

        /**
         * Registers a new public key on cloud provider
         * @param {string} name Name of the new key
         * @param {string} publicKey Public key contents
         * @returns {Promise}
         */

    }, {
        key: 'addKey',
        value: function addKey(name, publicKey) {
            return _CloudlinkHttp2.default.request(this.config, 'addKey', {
                name: name,
                publicKey: publicKey
            });
        }

        /**
         * Deletes a key from cloud provider
         * @param {string|number} id Key name/id
         * @returns {Promise}
         */

    }, {
        key: 'deleteKey',
        value: function deleteKey(id) {
            return _CloudlinkHttp2.default.request(this.config, 'deleteKey', {
                id: id
            });
        }

        /**
         * Returns a list of VPCs (Virtual private network)
         * @param {{}} filters Filters object
         * @param {Array} ids Ids list
         * @returns {Promise}
         */

    }, {
        key: 'listVpcs',
        value: function listVpcs() {
            var filters = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var ids = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            return _CloudlinkHttp2.default.request(this.config, 'listVpcs', {
                filters: filters,
                ids: ids
            });
        }

        /**
         * Creates a new VPC (Virtual private network)
         * @param cidr CIDR block, network range
         * @param tenancy Tenancy default/dedicated/host
         * @returns {Promise}
         */

    }, {
        key: 'addVpc',
        value: function addVpc(cidr, tenancy) {
            return _CloudlinkHttp2.default.request(this.config, 'addVpc', {
                cidr: cidr,
                tenancy: tenancy
            });
        }

        /**
         * Sets/adds vpc attribute
         * @param vpcId
         * @param attributes
         * @returns {Promise}
         */

    }, {
        key: 'addVpcAttribute',
        value: function addVpcAttribute(vpcId, attributes) {
            return _CloudlinkHttp2.default.request(this.config, 'addVpcAttribute', {
                vpcId: vpcId,
                attributes: attributes
            });
        }

        /**
         * Returns vpc attribute value
         * @param vpcId
         * @param attribute
         * @returns {Promise}
         */

    }, {
        key: 'getVpcAttribute',
        value: function getVpcAttribute(vpcId, attribute) {
            return _CloudlinkHttp2.default.request(this.config, 'getVpcAttribute', {
                vpcId: vpcId,
                attribute: attribute
            });
        }

        /**
         * Returns a list of subnets
         * @param ids
         * @param filters
         * @returns {Promise}
         */

    }, {
        key: 'listSubNets',
        value: function listSubNets() {
            var ids = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
            var filters = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            return _CloudlinkHttp2.default.request(this.config, 'listSubNets', {
                ids: ids,
                filters: filters
            });
        }

        /**
         * Creates a new subnet within a VPC
         * @param cidr CIDR block, network range
         * @param vpcId VPC id
         * @returns {Promise}
         */

    }, {
        key: 'addSubNet',
        value: function addSubNet(cidr, vpcId) {
            return _CloudlinkHttp2.default.request(this.config, 'addSubNet', {
                cidr: cidr,
                vpcId: vpcId
            });
        }

        /**
         * Sets "assignPublicIp" property for a subNet
         * @param subNetId
         * @param assignPublicIp
         * @returns {Promise}
         */

    }, {
        key: 'setSubNetAttribute',
        value: function setSubNetAttribute(subNetId, assignPublicIp) {
            return _CloudlinkHttp2.default.request(this.config, 'setSubNetAttribute', {
                subNetId: subNetId,
                assignPublicIp: assignPublicIp
            });
        }

        /**
         * Creates a new security group under a vpcId
         * @param vpcId
         * @param name
         * @param description
         * @returns {Promise}
         */

    }, {
        key: 'addSecurityGroup',
        value: function addSecurityGroup(vpcId, name, description) {
            return _CloudlinkHttp2.default.request(this.config, 'addSecurityGroup', {
                vpcId: vpcId,
                name: name,
                description: description
            });
        }

        /**
         * Creates a set of inbound security group rules
         * @param groupId
         * @param rules
         * @returns {Promise}
         */

    }, {
        key: 'addSecurityGroupInboundRules',
        value: function addSecurityGroupInboundRules(groupId, rules) {
            return _CloudlinkHttp2.default.request(this.config, 'addSecurityGroupInboundRules', {
                groupId: groupId,
                rules: rules
            });
        }

        /**
         * Creates a set of outbound security group rules
         * @param groupId
         * @param rules
         * @returns {Promise}
         */

    }, {
        key: 'addSecurityGroupOutboundRules',
        value: function addSecurityGroupOutboundRules(groupId, rules) {
            return _CloudlinkHttp2.default.request(this.config, 'addSecurityGroupOutboundRules', {
                groupId: groupId,
                rules: rules
            });
        }

        /**
         * Creates a new internet gateway
         * @returns {Promise}
         */

    }, {
        key: 'addInternetGateway',
        value: function addInternetGateway() {
            return _CloudlinkHttp2.default.request(this.config, 'addInternetGateway', {});
        }

        /**
         * Attaches internet gateway to VPC
         * @param vpcId
         * @param gatewayId
         * @returns {Promise}
         */

    }, {
        key: 'attachInternetGateway',
        value: function attachInternetGateway(vpcId, gatewayId) {
            return _CloudlinkHttp2.default.request(this.config, 'attachInternetGateway', {
                vpcId: vpcId,
                gatewayId: gatewayId
            });
        }

        /**
         * Lists all routes tables, may apply filters
         * @param filters
         * @returns {Promise}
         */

    }, {
        key: 'listRouteTables',
        value: function listRouteTables(filters) {
            return _CloudlinkHttp2.default.request(this.config, 'listRouteTables', {
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

    }, {
        key: 'addRoute',
        value: function addRoute(routesTableId, cidr, gatewayId) {
            return _CloudlinkHttp2.default.request(this.config, 'addRoute', {
                routesTableId: routesTableId,
                cidr: cidr,
                gatewayId: gatewayId
            });
        }
    }]);

    return CloudlinkApi;
}();