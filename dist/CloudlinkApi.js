'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Promise = require('promise');

/**
 * List of supported cloud providers
 * @type {string[]}
 */
var supportedClouds = ['aws', 'digitalocean'];

/**
 * CloudlinkApiError class
 * @extends {Error}
 */

var CloudlinkApiError = function (_Error) {
    _inherits(CloudlinkApiError, _Error);

    function CloudlinkApiError() {
        _classCallCheck(this, CloudlinkApiError);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(CloudlinkApiError).apply(this, arguments));
    }

    return CloudlinkApiError;
}(Error);

/**
 * Make an http request to the service
 * @param config
 * @param method
 * @param params
 * @returns {Promise}
 */


var httpRequest = function httpRequest(config, method, params) {
    var http = null;
    var postData = params || {};
    if (config.server.secure) {
        http = require('https');
    } else {
        http = require('http');
    }
    postData.auth = config.auth || {};
    postData = JSON.stringify(postData);
    return new Promise(function (resolve, reject) {
        var request = http.request({
            hostname: config.server.host,
            port: config.server.port,
            path: '/' + config.cloud + '/' + method,
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
        function (response) {
            var data = '';
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                data = JSON.parse(data);
                if (data.status) {
                    resolve(data.data);
                } else {
                    reject(new CloudlinkApiError(data.error || 'Unknown error'));
                }
            });
        });
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

var CloudlinkApi = exports.CloudlinkApi = function () {

    /**
     * CloudlinkApi constructor
     * @param {{}} config Configurations object (must include "auth" and "server" properties)
     * @throws {CloudlinkApiError}
     */

    function CloudlinkApi(config) {
        _classCallCheck(this, CloudlinkApi);

        /* eslint max-statements: ["error", 20] */

        this.config = config || {};
        if (!this.config.cloud) {
            throw new CloudlinkApiError('Missing "cloud" definition in config');
        }
        if (supportedClouds.indexOf(this.config.cloud) === -1) {
            throw new CloudlinkApiError('"' + this.config.cloud + '" is not a supported cloud provider');
        }
        if (!this.config.server) {
            throw new CloudlinkApiError('Missing "server" object in config');
        }
        if (!this.config.server.host) {
            throw new CloudlinkApiError('Messing "server.host" in config');
        }
        if (!this.config.server.port) {
            this.config.server.port = 80;
        }
        if (!this.config.server.secure) {
            this.config.server.secure = false;
        }
        if (!this.config.auth) {
            throw new CloudlinkApiError('Missing "auth" object in config');
        }
    }

    /**
     * Returns a list of instances (Virtual machines)
     * @returns {Promise}
     */


    _createClass(CloudlinkApi, [{
        key: 'listInstances',
        value: function listInstances() {
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

    }, {
        key: 'addInstance',
        value: function addInstance(names, region, image, size, sshKey) {
            return httpRequest(this.config, 'addInstance', {
                names: names,
                region: region,
                image: image,
                size: size,
                sshKey: sshKey
            });
        }

        /**
         * Returns the status of an instance (Virtual machine)
         * @param {string|number} instanceId
         * @returns {Promise}
         */

    }, {
        key: 'getInstanceStatus',
        value: function getInstanceStatus(instanceId) {
            return httpRequest(this.config, 'getInstanceStatus', {
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
            return httpRequest(this.config, 'listRegions', {});
        }

        /**
         * Returns a list of sizes available on cloud provider
         * @returns {Promise}
         */

    }, {
        key: 'listSizes',
        value: function listSizes() {
            return httpRequest(this.config, 'listSizes', {});
        }

        /**
         * Returns a list of distributions available on cloud provider
         * @param {{}} filters
         * @returns {Promise}
         */

    }, {
        key: 'listDistributions',
        value: function listDistributions() {
            var filters = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            return httpRequest(this.config, 'listDistributions', {
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
            return httpRequest(this.config, 'listVolumes', {});
        }

        /**
         * Returns a list of SSH keys registered on cloud provider
         * @returns {Promise}
         */

    }, {
        key: 'listKeys',
        value: function listKeys() {
            return httpRequest(this.config, 'listKeys', {});
        }

        /**
         * Registers a new public key on cloud provider
         * @param {string} name
         * @param {string} publicKey
         * @returns {Promise}
         */

    }, {
        key: 'addKey',
        value: function addKey(name, publicKey) {
            return httpRequest(this.config, 'addKey', {
                name: name,
                publicKey: publicKey
            });
        }

        /**
         * Deletes a key from cloud provider
         * @param {string|number} id
         * @returns {Promise}
         */

    }, {
        key: 'deleteKey',
        value: function deleteKey(id) {
            return httpRequest(this.config, 'deleteKey', {
                id: id
            });
        }

        /**
         * Returns a list of VPCs (Virtual private network)
         * @param {{}} filters
         * @param {Array} ids
         * @returns {Promise}
         */

    }, {
        key: 'listVpcs',
        value: function listVpcs() {
            var filters = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
            var ids = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            return httpRequest(this.config, 'listVpcs', {
                filters: filters,
                ids: ids
            });
        }

        /**
         * Creates a new VPC (Virtual private network)
         * @param cidr
         * @param tenancy
         * @returns {Promise}
         */

    }, {
        key: 'addVpc',
        value: function addVpc(cidr, tenancy) {
            return httpRequest(this.config, 'addVpc', {
                cidr: cidr,
                tenancy: tenancy
            });
        }

        /**
         * Returns a list of subnets
         * @returns {Promise}
         */

    }, {
        key: 'listSubNets',
        value: function listSubNets() {
            return httpRequest(this.config, 'listSubNets', {});
        }

        /**
         * Creates a new subnet within a VPC
         * @param cidr
         * @param vpcId
         * @returns {Promise}
         */

    }, {
        key: 'addSubNet',
        value: function addSubNet(cidr, vpcId) {
            return httpRequest(this.config, 'addSubNet', {
                cidr: cidr,
                vpcId: vpcId
            });
        }
    }]);

    return CloudlinkApi;
}();