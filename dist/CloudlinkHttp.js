'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CloudlinkApiError = require('./CloudlinkApiError');

var _CloudlinkApiError2 = _interopRequireDefault(_CloudlinkApiError);

var _promise = require('promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * CloudlinkHttp class
 */

var CloudlinkHttp = function () {
    function CloudlinkHttp() {
        _classCallCheck(this, CloudlinkHttp);
    }

    _createClass(CloudlinkHttp, null, [{
        key: 'request',


        /**
         * Make an http request to the service
         * @param {{}} config Cloudlink configuration object
         * @param {string} method Method name to call
         * @param {{}} params Request parameters
         * @returns {Promise}
         */
        value: function request(config, method, params) {
            var http = null;
            var postData = params || {};
            if (config.server.secure) {
                http = require('https');
            } else {
                http = require('http');
            }
            postData.auth = config.auth || {};
            postData = JSON.stringify(postData);
            return new _promise2.default(function (resolve, reject) {
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
                 * Handle response
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
                            reject(new _CloudlinkApiError2.default(data.error || 'Unknown error'));
                        }
                    });
                });
                request.on('error', reject);
                request.write(postData);
                request.end();
            });
        }
    }]);

    return CloudlinkHttp;
}();

exports.default = CloudlinkHttp;