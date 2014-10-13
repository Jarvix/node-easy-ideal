node-easy-ideal
===============

[![Build Status](https://travis-ci.org/Jarvix/node-easy-ideal.svg?branch=master)](https://travis-ci.org/Jarvix/node-easy-ideal)

Qantani Easy iDeal API client for Node (unofficial)

## Getting Started ##

Install using npm
```bash
$ npm install easy-ideal
```

Import the library
```js
var EasyIdeal = require('easy-ideal');
```

Create an easy ideal instance.
```js
var easyideal = new EasyIdeal({
  merchant: {
    id: YOUR_MERCHANT_ID,
    key: YOUR_MERCHANT_KEY,
    secret: YOUR_MERCHANT_SECRET
  }
});
```

### Acquiring a list of banks ###

```js
easyideal.banks(function(error,banks) {
  if(error)
    throw error;
  console.log(banks);
});
```
Outputs:
```js
[
  {
    id: 'ING',
    name: 'ING'
  },
  {
    id: 'RABOBANK',
    name: 'Rabobank'
  },
  ...
]
```
You should cache this output with a TTL of 2 days.

### Executing a transaction ###

```js
var transaction = {
  amount: 10.0,
  currency: 'EUR',
  description: 'A test transaction.',
  return: 'http://example.com/thanks',
  bank: 'ING'
};

easyideal.execute(transaction,function(error,info) {
  console.log(info);
});
```

Outputs:
```js
{
  transaction: {
    id: '124',
    code: '12335kjhkjdg'
  },
  bank_url: 'https://www.qantanipayments.com/.....'
}
```

Do not forget to store these values. You need them to respond to the Qantani callbacks.
Note that EasyIdeal only supports transactions with EUR currency.

For more information, see the documentation and the Qantani implementation manual.

## Documentation ##

This package supports jsdoc. Simply install jsdoc and run it
```bash
$ npm install -g jsdoc
$ jsdoc -d docs
$ open docs/index.html
```

## License ##

BSD 2-clause:

```text
Copyright (c) 2014, Jos Kuijpers
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

```
