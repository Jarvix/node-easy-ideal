/* global describe, it */
'use strict';

var EasyIdeal = require('../lib/easyideal'),
    assert = require('assert');

describe('Easy Ideal', function () {
    describe.skip('#banks()', function () {
        it('should do stuff', function (done) {
            this.timeout(5000);
            var easyideal = new EasyIdeal({
                merchant: {
                    id: '',
                    key: '',
                    secret: ''
                }
            });

            easyideal.banks(function (err, results) {
                if (err)
                    throw err;
                done();
            });
        });
    });

    describe.skip('#execute()', function () {
        it('should do stuff', function (done) {
            this.timeout(5000);
            var easyideal = new EasyIdeal({
                merchant: {
                    id: '',
                    key: '',
                    secret: ''
                }
            });

            var transaction = {
                amount: 8,
                currency: 'EUR',
                description: 'Mocha Test',
                return :'http://www.google.com',
                bank: 'ING'
            };

            easyideal.execute(transaction, function (err, bankurl) {
                if (err)
                    throw err;

                done();
            });
        });
    });
});
