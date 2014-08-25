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
    if (object === null || object === undefined)
        throw new Error('Can\'t take length of null or undefined. Make sure the JSON is valid.');
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

    // Assert a valid string input
    if (!_.isString(xml))
        throw new Error('Input must be a string');

    xml = xml.trim();
    if (xml.length === 0)
        throw new Error('Input must contain characters');

    // Remove comments
    xml = xml.replace(/<!--.*?-->/g, '');

    /**
     * Parse the document.
     */
    function document() {
        // Skip declaration
        declaration();

        return tag();
    }

    /**
     * Parse declaration
     *
     * @return {Object} - The declaration attributes.
     */
    function declaration() {
        var m = match(/^<\?xml\s*/);
        if (!m)
            return;

        var decl = {};

        while (!eos() && !is('?>')) {
            var attr = attribute();
            if (!attr)
                return decl;

            decl[attr.name] = attr.value;
        }

        match(/\?>\s*/);

        return decl;
    }

    function attribute() {
        var m = match(/([\w:]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
        if (!m)
            return;

        return {
            name: m[1],
            value: strip(m[2])
        }
    }

    function tag() {
        var item = {};

        var m = match(/^<([\w+:]+)\s*/);
        if (!m)
            return;

        var node = {
            name: m[1]
        }

        // Skip attributes
        while (!eos() && !is('>') && !is('?>') && !is('/>')) {
            var attr = attribute();
            if (!attr)
                throw new Error('Expected attribute.');
        }

        // Self closing
        if (match(/^\s*\/>\s*/)) {
            item[m[1]] = '';
            return item;
        }

        // End
        match(/\??>\s*/);

        // Content
        var cont = content();
        if (cont) {
            node.content = cont;
        } else {
            var children = [];

            // Children
            var child;
            while ((child = tag())) {
                children.push(child);
            }

            if (children.length > 0)
                node.children = children;
        }

        // Closing
        match(/^<\/[\w:]+>\s*/);

        if (node.children) {
            var sub = {};

            _.each(node.children, function (child) {
                var keys = _.keys(child);
                if (keys.length > 1) {
                    console.log('[L' + level + '] ' + child);
                    throw new Error('Unsupported configuration');
                }
                if (keys.length === 0) {
                    console.log('[L' + level + '] no keys', child, typeof child);
                }

                // The key that matters
                var key = keys[0];

                if (!sub[key]) // Set the value
                    sub[key] = child[key];
                else if (_.isArray(sub[key])) // Add to existing array
                    sub[key].push(child[key]);
                else { // Make array if there is already a value
                    var tmp = sub[key];
                    sub[key] = [tmp, child[key]];
                }
            });

            item[node.name] = sub;
        } else
            item[node.name] = node.content || '';

        return item;
    }

    function content() {
        var m = match(/^([^<]*)/);
        if (m)
            return m[1];

        return '';
    }

    /**
     * Strip quotes.
     *
     * @param {String} val - Attribute value
     * @return {String} - `val` without quotes.
     */
    function strip(val) {
        return val.replace(/^["']|['"]$/g, '');
    }

    /**
     * Match the regex and advance the string.
     *
     * @param {RegEx} regex - Regex to match
     * @return {?String} The matched string.
     */
    function match(regex) {
        var theMatch = xml.match(regex);
        if (!theMatch)
            return null;

        xml = xml.slice(theMatch[0].length);

        return theMatch;
    }

    /**
     * End of source
     *
     * @return {Boolean} - true if end of source, false otherwise.
     */
    function eos() {
        return xml.length === 0;
    }

    /**
     * Check for prefix.
     *
     * @param {String} prefix
     * @return {Boolean} - True if matches prefix, false otherwise.
     */
    function is(prefix) {
        return xml.indexOf(prefix) === 0;
    }

    return document();
}

module.exports = {
    generate: generate,
    parse: parse
};
