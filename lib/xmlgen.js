'use strict';

/**
 * @module xmlgen
 */

var _ = require('lodash'),
    assert = require('assert');

/**
 * Generate xml from a javascript object.
 *
 * @param {Object|Array|String|Number} input - Input data.
 * @param {Object} [options] - Options.
 * @param {Boolean} [options.fold=true] - Whether to fold empty elements.
 * @param {Boolean|Object} [options.declaration=false] - Declaration data.
 */
function xmlgen(input, options) {
    var _options = {
        fold: true,
        declaration: false
    };
    var xml = '';

    // Save the options.
    _options = _.defaults(options || {}, _options);

    // Assert a valid root tree
    if (_.isArray(input) || !_.isObject(input))
        throw new Error('Root node must be an Object.');

    // Write the declaration
    if (_options.declaration)
        xml += '<?xml version="1.0" encoding="UTF-8"?>';

    // Recursive element printing function
    function element(parent, name, object) {
        var string = '';

        // Folded tag
        if (_options.fold && length(object) === 0) {
            string = '<' + name + '/>'
        } else if (_.isArray(object)) {
            _.each(object, function (value) {
                string += element(name, name, value);
            });
        } else {
            string = '<' + name + '>';

            if (_.isObject(object)) {
                _.each(object, function (value, key) {
                    string += element(name, key, value);
                });
            } else
                string += '' + object;

            string += '</' + name + '>';
        }

        return string;
    }

    // Root elements
    _.each(input, function (value, key) {
        xml += element(null, key, value);
    });

    // console.log(xml);

    return xml;
}

function length(object) {
    if (!_.isObject(object))
        return object.length;
    return Object.keys(object).length;
}

module.exports = xmlgen;
