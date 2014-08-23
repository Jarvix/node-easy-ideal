/* global describe, it */
'use strict';

var EasyIdeal = require('../lib/easyideal'),
    assert = require('assert');

describe('Easy Ideal', function () {
    describe('#banks()', function () {
        it('should do stuff', function (done) {
            var easyideal = new EasyIdeal({
                merchant: {
                    id: 'A',
                    key: 'A',
                    secret: 'A'
                }
            });

            easyideal.banks(function (err, results) {
                if (err)
                    throw err;



                done();
            });
        });
    });
});
