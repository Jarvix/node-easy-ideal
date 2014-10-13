/* global describe, it */
'use strict';

var checksum = require('../lib/checksum'),
    assert = require('assert'),
    crypto = require('crypto');

describe('Checksum function', function () {
    it('should generate a correct checksum', function () {
        assert.equal('434c7a1599118ef14d0f2aa1811c7a48a1a5371b', checksum.make({
            Amount: 9.95,
            Bank: 'ABN_AMRO',
            Return: 'http://www.mijnwebsite.nl/bedankt.php',
            Description: 'Testbetaling',
            Currency: 'EUR'
        }, '12345'));
    });

    it('should generate a correct checksum when no data supplied', function () {
        // Create shasum to test against
        var shasum = crypto.createHash('sha1');
        shasum.update('12345');

        assert.equal(checksum.make({}, '12345'), shasum.digest('hex'));
    });

    it('should throw an error if input is not an object', function () {
        assert.throws(function () {
            checksum.make(null, '12345');
        }, Error);
    });

    it('should throw an error if no merchant secret is supplied', function () {
        assert.throws(function () {
            checksum.make({});
        }, Error);
    });
});
