'use strict';

var EasyIdeal = require('../lib/easyideal'),
    assert = require('assert'),
    crypto = require('crypto');

function createClient() {
    return new EasyIdeal({
        merchant: {
            id: 'SomeId',
            key: 'MyKey',
            secret: '12345'
        }
    });
}

function testSimpleChecksum() {
    var easyideal = createClient();

    var checksum = easyideal._checksum({
        Amount: 9.95,
        Bank: 'ABN_AMRO',
        Return: 'http://www.mijnwebsite.nl/bedankt.php',
        Description: 'Testbetaling',
        Currency: 'EUR'
    });

    assert.equal(checksum, '434c7a1599118ef14d0f2aa1811c7a48a1a5371b');
}

function testEmptyData() {
    var easyideal = createClient();

    // Generate checksum
    var checksum = easyideal._checksum({});

    // Create shasum to test against
    var shasum = crypto.createHash('sha1');
    shasum.update('12345');

    assert.equal(checksum, shasum.digest('hex'));
}

testSimpleChecksum();
testEmptyData();
