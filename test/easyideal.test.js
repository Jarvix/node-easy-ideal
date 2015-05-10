/* global describe, it */
'use strict';

var EasyIdeal = require('../lib/easyideal'),
    assert = require('assert');

function createIdeal() {
    return new EasyIdeal({
        merchant: {
            id: '',
            key: '',
            secret: ''
        }
    });
}

describe('Easy Ideal', function () {
    describe('#banks()', function () {
        var easyideal = createIdeal();

        it.skip('should do stuff', function (done) {
            this.timeout(5000);

            easyideal.banks(function (err, results) {
                if (err)
                    throw err;
                done();
            });
        });
    });

    describe('#execute()', function () {
        var easyideal = createIdeal();

        it.skip('should do stuff', function (done) {
            this.timeout(5000);

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

                console.log('ID: ', easyideal.lastTransactionId, 'Code: ', easyideal.lastTransactionCode);
                console.log(bankurl);

                done();
            });
        });
    });

    describe('#getPaymentStatus', function () {
        var easyideal = createIdeal();

        it('should throw with invalid checksum', function () {
            assert.throws(function () {
                easyideal.getPaymentStatus('id', '1', 'salt', 'checksum', 'transactioncode');
            }, Error);
        });
    });

    describe('#getTransactionStatus', function () {
        var easyideal = createIdeal();

        it('should throw with invalid parameters', function () {
            assert.throws(function () {
                easyideal.getTransactionStatus(null, null, null);
            }, Error);
        });

        it.skip('it should do stuff', function (done) {
            easyideal.getTransactionStatus('', '', function (
                err, res) {
                console.log(err, res);
                done(err);
            });
        });
    });

});
