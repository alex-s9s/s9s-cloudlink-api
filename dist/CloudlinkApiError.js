"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * CloudlinkApiError class
 * used to throw/catch custom errors
 * @class CloudlinkApiError
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

exports.default = CloudlinkApiError;