'use strict';

var _ = require('lodash'),
    crypto = require('crypto');

/**
 * Create a hex sha1 from a value.
 *
 * @param {String} string - String to hash.
 * @return {String} Hash
 */
function sha1(string) {
    var shasum = crypto.createHash('sha1');
    shasum.update(string);
    return shasum.digest('hex');
}

/**
 * Easy Ideal banks and transaction management.
 *
 * @constructor
 *
 * @param {Object} config - Configuration of the client.
 * @param {Object} config.merchant - Merchant information
 * @param {String} config.merchant.id - Merchant ID
 * @param {String} config.merchant.key - Merchant Key
 * @param {String} config.merchant.secret - Merchant Secret
 */
function EasyIdeal(config) {
    var _bankCache = [];
    var _merchant = {};

    // Parse config
    _merchant = config.merchant;

    /**
     * Generate a checksum.
     *
     * @private
     * @param {Object} data - The data to generate checksum for.
     * @return {String} - The checksum
     */
    function checksum(data) {
        // Sort the keys
        var keys = _.sortBy(_.keys(data));

        var reduced = '';
        if (keys.length > 0) {
            // get the sorted values
            var values = _.map(keys, function (key) {
                return data[key];
            });

            // Append them to each other
            reduced = _.reduce(values, function (memo, value) {
                return memo + value;
            });
        }

        // Append the merchant secret
        reduced += _merchant.secret;

        return sha1(reduced);
    }
    this._checksum = checksum;

    /**
     * Acquire a list of banks
     *
     * @param {EasyIdeal~banksCallback} callback - The callback that handles the response.
     * @param {Boolean} [nocache=false] - Whether to omit using the cache.
     */
    this.banks = function (callback, nocache) {};

    /**
     * Execute a payment.
     *
     * @param {Object} transaction - The transaction info
     * @param {Number} transaction.amount - The amount to deduct from the bank account.
     * @param {String} transaction.currency - Currency to use.
     * @param {String} transaction.description - Description / order number.
     * @param {String} transaction.return - Return URL to call after the payment has been made or cancelled
     * @param {String} transaction.bank - The banks ID.
     * @param {EasyIdeal~transactionCallback} callback - The callback that handles the response.
     */
    EasyIdeal.prototype.execute = function (transaction, callback) {};
}

/**
 * Banks callback.
 *
 * @callback EasyIdeal~banksCallback
 * @param {?Error} error - An error, or null if no error.
 * @param {?Array<Object>} banks - A list of banks or null if error.
 */

/**
 * Transaction callback.
 *
 *
 * @callback EasyIdeal~transactionCallback
 * @param {?Error} error - An error, or null if no error.
 * @param {?String} url - URL of the bank to refer the user to, in
 *  order for the user to make the payment. Null if error.
 */

module.exports = EasyIdeal;
