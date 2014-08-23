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
 * Generate a checksum.
 *
 * @private
 * @param {Object} data - The data to generate checksum for.
 * @return {String} - The checksum
 */
function checksum(data, secret) {
    if (!_.isObject(data))
        throw new Error('Data must be an Object');
    if (secret === null || secret === undefined)
        throw new Error('No merchant secret supplied');

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
    reduced += secret;

    return sha1(reduced);
}

module.exports = checksum;
