'use strict';

/**
 * @module xmlgen
 */

var _ = require('lodash'),
    assert = require('assert');

/**
 * Acquire the length of any object.
 *
 * Object length is number of keys,
 * String length is number of characters,
 * Array length is number of elements.
 */
function length(object) {
    if (!_.isObject(object))
        return object.length;
    return Object.keys(object).length;
}

/**
 * Generate xml from a javascript object.
 *
 * @param {Object|Array|String|Number} input - Input data.
 * @param {Object} [options] - Options.
 * @param {Boolean} [options.fold=true] - Whether to fold empty elements.
 * @param {Boolean|Object} [options.declaration=false] - Declaration data.
 */
function generate(input, options) {
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

    function generateDeclaration(declaration) {
        var encoding = declaration.encoding || 'UTF-8';
        var attributes = {
            version: '1.0',
            encoding: encoding
        };

        if (declaration.standalone)
            attributes.standalone = declaration.standalone;

        var xml = '<?xml';

        _.each(attributes, function (value, key) {
            xml += ' ' + key + '="' + value + '"';
        });

        xml += '?>'

        return xml;
    }

    // Write the declaration
    if (_options.declaration)
        xml += generateDeclaration(_options.declaration || false);

    // Root elements
    _.each(input, function (value, key) {
        xml += element(null, key, value);
    });

    // console.log(xml);

    return xml;
}

function parse(xml, options) {
    var _options = {};

    // Save the options.
    _options = _.defaults(options || {}, _options);

    // Assert a valid root tree
    if (!_.isString(xml))
        throw new Error('Input must be a string');

    return {};
}

module.exports = {
    generate: generate,
    parse: parse
};
