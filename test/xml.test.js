/* global describe, it */
'use strict';

var xml = require('../lib/xml'),
    xmlgen = xml.generate,
    assert = require('assert');

describe('XML generator', function () {
    it('should throw an error if root is not an object', function () {
        assert.throws(function () {
            xmlgen(5)
        }, Error);
        assert.throws(function () {
            xmlgen('')
        }, Error);
        assert.throws(function () {
            xmlgen([])
        }, Error);
    });

    describe('Leaf elements', function () {
        it('should output a single element with contents', function () {
            assert.equal('<foo>bar</foo>', xmlgen({
                foo: 'bar'
            }));
        });

        it('should fold empty elements if fold is true', function () {
            assert.equal('<foo/>', xmlgen({
                foo: ''
            }));
        });

        it('should not fold empty elements if fold is false', function () {
            assert.equal('<foo></foo>', xmlgen({
                foo: ''
            }, {
                fold: false
            }));
        });
    });

    describe('Objects', function () {
        it('should be printed', function () {
            assert.equal('<foo><a>b</a><c>d</c></foo>', xmlgen({
                foo: {
                    a: 'b',
                    c: 'd'
                }
            }));
        });
    });

    describe('Arrays', function () {
        it('should work with string elements', function () {
            assert.equal('<foo>a</foo><foo>b</foo>', xmlgen({
                foo: ['a', 'b']
            }));
        });

        it('should work with object elements', function () {
            var out = '<book>Loner, part one</book><book><title>Harry Potter</title>';
            out += '<author>J.K. Rowling</author></book>';
            assert.equal(out, xmlgen({
                'book': [
                    'Loner, part one', {
                        title: 'Harry Potter',
                        author: 'J.K. Rowling'
                    }
                ]
            }));
        });
    });

    describe('Declaration', function () {
        it('should be hidden if not asked for', function () {
            assert.equal('<foo>bar</foo>', xmlgen({
                foo: 'bar'
            }));
        });
        it('should be printed if asked for', function () {
            assert.equal('<?xml version="1.0" encoding="UTF-8"?><foo>bar</foo>', xmlgen({
                foo: 'bar'
            }, {
                declaration: true
            }));
        });
        it('should use declaration options', function () {
            assert.equal('<?xml version="1.0" encoding="UTF-16" standalone="yes"?><foo>bar</foo>',
                xmlgen({
                    foo: 'bar'
                }, {
                    declaration: {
                        standalone: 'yes',
                        encoding: 'UTF-16'
                    }
                }));
        });
    });

    describe('Tree', function () {
        it('should gracefully print this example', function () {
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

            var output =
                '<?xml version="1.0" encoding="UTF-8"?><Transaction><Action><Name>IDEAL.GETBANKS</Name>';
            output +=
                '<Version>1</Version></Action><Merchant><ID>A</ID><Key>B</Key><Checksum>C</Checksum>';
            output += '</Merchant></Transaction>';

            assert.equal(output, xmlgen(input, {
                declaration: true
            }));
        });
    });
});

describe('XML parser', function () {
    it('should throw an error if input is not a string', function () {
        assert.throws(function () {
            xml.parse(5)
        }, Error);
        assert.throws(function () {
            xml.parse({})
        }, Error);
        assert.throws(function () {
            xml.parse([])
        }, Error);
    });
});
