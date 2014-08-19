'use strict';

var EasyIdeal = require('../lib/easyideal'),
    assert = require('assert');

function test1() {
    var easyideal = new EasyIdeal({
        merchant: {
            id: 'SomeId',
            key: 'MyKey',
            secret: 'SomeSecret'
        }
    });

    assert.notEqual(easyideal, null);

    easyideal.execute();
    easyideal.banks();
}

function test() {
    test1();
}

test();
