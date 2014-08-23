'use strict';

/**
 * @module easyideal
 */

var _ = require('lodash'),
    checksum = require('./checksum'),
    xml = require('./xml'),
    https = require('https'),
    querystring = require('querystring')

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
     * Send a post request to the API server, and retrieve the response.
     *
     * @param {Object} - Object with parameters and values for the body.
     * @param {Function} - Callback function.
     */
    function post(postdata, callback) {
        var query = querystring.stringify(postdata);

        // Open a request
        var req = https.request({
            hostname: 'www.qantanipayments.com',
            port: 443,
            path: '/api/',
            method: 'POST',
            headers: {
                'Content-Length': query.length
            }
        }, function (res) {
            var data = '';

            res.on('data', function (d) {
                data += d;
            })

            res.on('end', function () {
                callback(null, data);
            })
        });

        // Write the body data
        req.write(query);

        // End the request
        req.end();

        req.on('error', function (error) {
            callback(error);
        });
    }

    /**
     * Make a call to an API function.
     *
     * @param {String} - Action
     * @param {Object} - Paramaters
     * @param {[type]} - XX
     * @param {Function} - Callback
     */
    function call(action, paramaters, XX, callback) {
        // Create the transaction
        var input = {
            Transaction: {
                Action: {
                    Name: action,
                    Version: 1
                },
                Parameters: paramaters,
                Merchant: {
                    ID: _merchant.id,
                    Key: _merchant.key,
                    Checksum: checksum(paramaters, _merchant.secret)
                }
            }
        };

        var postdata = {
            data: xml.generate(input, {
                declaration: true
            })
        };

        post(postdata, function (error, result) {
            console.log('post done');
            if (error)
                return callback(error);

            // Parse the XML to JSON
            var output = xml.parse(result);

            console.log(output);

            // Check for error

            callback(error, result);
        });
    }

    /**
     * Acquire a list of banks
     *
     * @param {EasyIdeal~banksCallback} callback - The callback that handles the response.
     * @param {Boolean} [nocache=false] - Whether to omit using the cache.
     */
    this.banks = function (callback, nocache) {

        var request = {
            Transaction: {
                Action: {
                    Name: 'IDEAL.GETBANKS',
                    Version: 1
                },
                Merchant: {
                    ID: _merchant.id,
                    Key: _merchant.key,
                    Checksum: checksum({}, _merchant.secret)
                }
            }
        };

        call('IDEAL.GETBANKS', {}, null, function (err, result) {
            console.log('Result from call ', err, result);

            callback(null, null);
        });
    };

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
    this.execute = function (transaction, callback) {};
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
