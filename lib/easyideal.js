'use strict';

/**
 * Easy Ideal object.
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
    // Parse config
    /*
    Config: merchant ID, merchant key, merchant secret

    */
}

/**
 * Acquire a list of banks
 *
 * @param {EasyIdeal~banksCallback} callback - The callback that handles the response.
 * @param {Boolean} [nocache=false] - Whether to omit using the cache.
 */
EasyIdeal.prototype.banks = function (callback, nocache) {

};

/**
 * Banks callback.
 *
 * @callback EasyIdeal~banksCallback
 * @param {Error} error - An error, or null if no error.
 * @param {Array<Object<String,String>>} [banks=null] - A list of banks or null if error.
 */

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
EasyIdeal.prototype.execute = function(transaction, callback) {

};

/**
 * Transaction callback.
 *
 *
 * @callback EasyIdeal~transactionCallback
 * @param {Error} error - An error, or null if no error.
 * @param {String} [url=null] - URL of the bank to refer the user to, in
 *  order for the user to make the payment. Null if error.
 */

module.exports = EasyIdeal;
