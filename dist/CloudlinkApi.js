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
         * @returns {Promise}
         */

    }, {
        key: 'listRegions',
        value: function listRegions() {
            return httpRequest(this.config, 'listRegions', {});
        }

        /**
         * @returns {Promise}
         */

    }, {
        key: 'listSizes',
        value: function listSizes() {
            return httpRequest(this.config, 'listSizes', {});
        }

        /**
         * @param {{}} filters
         * @returns {Promise}
         */

    }, {
        key: 'listDistributions',
        value: function listDistributions() {
            var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var _ref$filters = _ref.filters;
            var filters = _ref$filters === undefined ? {} : _ref$filters;

            return httpRequest(this.config, 'listDistributions', {
                filters: filters
            });
        }

        /**
         * @returns {Promise}
         */

    }, {
        key: 'listVolumes',
        value: function listVolumes() {
            return httpRequest(this.config, 'listVolumes', {});
        }

        /**
         * @returns {Promise}
         */

    }, {
        key: 'listKeys',
        value: function listKeys() {
            return httpRequest(this.config, 'listKeys', {});
        }

        /**
         * @param {{}} filters
         * @param {Array} ids
         * @returns {Promise}
         */

    }, {
        key: 'listVpcs',
        value: function listVpcs() {
            var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            var _ref2$filters = _ref2.filters;
            var filters = _ref2$filters === undefined ? {} : _ref2$filters;
            var _ref2$ids = _ref2.ids;
            var ids = _ref2$ids === undefined ? [] : _ref2$ids;

            return httpRequest(this.config, 'listVpcs', {
                filters: filters,
                ids: ids
            });
        }

        /**
         * @returns {Promise}
         */

    }, {
        key: 'listSubNets',
        value: function listSubNets() {
            return httpRequest(this.config, 'listSubNets', {});
        }
    }]);

    return CloudlinkApi;
}();