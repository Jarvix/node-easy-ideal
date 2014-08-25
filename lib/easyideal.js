'use strict';

/**
 * @module easyideal
 */

var _ = require('lodash'),
    checksum = require('./checksum'),
    xml = require('./xml'),
    querystring = require('querystring'),
    requestify = require('requestify'),
    assert = require('assert');

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
    var _lastTransactionCode = null;
    var _lastTransactionID = null;

    /**
     * Transaction Code of the last call.
     * @type {[type]}
     */
    Object.defineProperty(this, 'lastTransactionCode', {
        get: function () {
            return _lastTransactionCode;
        }
    });

    /**
     * Transaction ID of the last call.
     * @type {[type]}
     */
    Object.defineProperty(this, 'lastTransactionID', {
        get: function () {
            return _lastTransactionID;
        }
    });

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
     * @param {String} action - Action
     * @param {Object} paramaters - List of parameters
     * @param {Array} path - Datapath that is needed. Will be filtered on.
     * @param {Function} callback - Callback (error,result)
     */
    function call(action, paramaters, path, callback) {
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
                if (output.Response.Response && output.Response.Response.Code !== undefined)
                    _lastTransactionCode = output.Response.Response.Code;
                else
                    _lastTransactionCode = null;

                if (output.Response.Response && output.Response.Response.TransactionID !== undefined)
                    _lastTransactionID = output.Response.Response.TransactionID;
                else
                    _lastTransactionID = null;

                // Filter the properties
                var pathed = output;
                for (var pathComponent in path) {
                    if (pathed[path[pathComponent]] !== undefined)
                        pathed = pathed[path[pathComponent]];
                    else
                        return callback(new Error('Path not found in structure.'), null);
                }

                callback(null, pathed);
            } else if (output.Response && output.Response.Status !== undefined) {
                var e = new Error(output.Response.Error.Description);
                e.code = output.Response.Error.ID + 0;

                callback(e, null);
            } else
                callback(new Error('Invalid response from server'), null);
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

        call('IDEAL.GETBANKS', {}, ['Response', 'Banks', 'Bank'], function (err, result) {
            if (err)
                return callback(err);

            var data = _.reduce(result, function (memo, bank, index) {
                memo.push({
                    id: bank.Id,
                    name: bank.Name
                });
                return memo;
            }, []);

            callback(null, data);
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
    this.execute = function (transaction, callback) {
        assert.notEqual(transaction.amount, undefined);
        assert.notEqual(transaction.currency, undefined);
        assert.notEqual(transaction.description, undefined);
        assert.notEqual(transaction.return, undefined);
        assert.notEqual(transaction.bank, undefined);

        var parameters = {
            Amount: transaction.amount + 0.0,
            Currency: transaction.currency,
            Description: transaction.description,
            Bank: transaction.bank,
            Return: transaction.return
        };


        call('IDEAL.EXECUTE', parameters, ['Response', 'Response', 'BankURL'], function (error, result) {
            if (error)
                return callback(error, null);

            result = result.replace('&amp;', '&');

            callback(error, result);
        });
    };
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
