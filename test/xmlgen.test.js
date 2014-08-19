'use strict';

var xmlgen = require('../lib/xmlgen'),
    assert = require('assert');

/**
 * Test helper function.
 *
 * You can change the values after construction.
 *
 * @constructor
 * @param {Object} input - Input to generate xml from.
 * @param {String} output - The expected output.
 * @param {Object} options - Options to pass to the generator.
 */
function TestHelper(input, output, options) {
    this.input = input;
    this.output = output;
    this.options = options;

    this.run = function () {
        assert.equal(xmlgen(this.input, this.options), this.output);
    }
}

/**
 * A simple test with a single element and a value.
 */
(function testSingleElement() {
    var input = {
        foo: 'bar'
    };
    var output = '<foo>bar</foo>';

    new TestHelper(input, output).run();
})();

/**
 * Generating an element with no value.
 *
 * This test has two parts: one where folding is expected,
 * and one where folding is turned off using an option.
 */
(function testEmptyElement() {
    var input = {
        foo: ''
    };
    var output = '<foo/>';

    var helper = new TestHelper(input, output);
    helper.run();

    helper.output = '<foo></foo>';
    helper.options = {
        fold: false
    };
    helper.run();
})();

/**
 * Test empty input.
 */
(function testEmpty() {
    new TestHelper('', '').run();
})();

/**
 * Test array input.
 */
(function testArray() {
    var input = {
        'book': [
            'Loner, part one', {
                title: 'Harry Potter',
                author: 'J.K. Rowling'
            }
        ]
    };

    var output = '<book>Loner, part one</book><book><title>Harry ';
    output += 'Potter</title><author>J.K. Rowling</author></book>';

    new TestHelper(input, output).run();
})();

/**
 * Test an invalid array
 */
(function testArray() {
    var input = [{
        foo: 'bar'
    }];

    // TODO: assert fail
})();

/**
 * Test object input.
 */
(function testObject() {

})();

/**
 * Test the declaration options.
 */
(function testDeclaration() {
    var x = xmlgen({
        foo: 'bar'
    }, {
        declaration: true
    });

    assert.equal(x, '<?xml version="1.0" encoding="UTF-8"?><foo>bar</foo>');
})();

/**
 * Test a real world-case tree.
 */
(function testTree() {
    var input = {
        'Transaction': {
            'Action': {
                'Name': 'IDEAL.GETBANKS',
                'Version': 1
            },
            'Merchant': {
                'ID': 'A',
                'Key': 'B',
                'Checksum': 'C'
            }
        }
    };

    var output = '<?xml version="1.0" encoding="UTF-8"?><Transaction><Action><Name>IDEAL.GETBANKS</Name>';
    output += '<Version>1</Version></Action><Merchant><ID>A</ID><Key>B</Key><Checksum>C</Checksum>';
    output += '</Merchant></Transaction>';

    new TestHelper(input, output, {
        declaration: true
    }).run();
})();
