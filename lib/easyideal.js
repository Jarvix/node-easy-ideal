'use strict';

/**
 * @module easyideal
 */

var _ = require('lodash'),
    checksum = require('./checksum'),
    xml = require('./xml'),
    querystring = require('querystring'),
    requestify = require('requestify');

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

        requestify.post('https://www.qantanipayments.com/api/', query, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: null // Serve as string
        })

        .then(function (response) {
            callback(null, response.body);
        })

        .catch(function (error) {
            callback(error, null);
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
            if (error)
                return callback(error);

            // Parse the XML to JSON
            var output = xml.parse(result);

            // Check for error
            if (output.Response && output.Response.Status === 'OK') {
                console.log('OK!');

                console.log(JSON.stringify(output, null, 2));

                callback(null, output);
            } else if (output.Response && output.Response.Status !== undefined) {
                var e = new Error(output.Response.Error.Description);
                e.code = output.Response.Error.ID + 0;

                callback(e, null);
            } else {
                callback(new Error('Invalid response from server'), null);
            }
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
