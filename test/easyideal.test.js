/* global describe, it */
'use strict';

var EasyIdeal = require('../lib/easyideal'),
    assert = require('assert');

describe('Easy Ideal', function () {
    it('should do stuff', function () {
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
    });
});
