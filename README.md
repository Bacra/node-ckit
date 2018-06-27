CKIT
==================


[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![NPM License][license-image]][npm-url]

# Install

```
npm install ckit --save
```

# Useage

```javascript
var msg1 = ckit.Message(
{
    a: ckit.required.string,
    b: ckit.repeated.number,
    c: ckit.optional.number.default(3),
});

msg1.addMessage('msg1', msg1);

var msg2 = ckit.Message(
{
    d: msg1.required.string,
    e: msg1.required.msg1,
    f: msg1.required.object.shape(
        {
            g: msg1.required.string,
            h: msg1.optional.string.default('h'),
        })
});


console.log(msg1.check({a: 1, b: 1}));
console.log(msg2.check({d: 1, e: {a: 1}, f: {g: 1}}));
```


[npm-image]: http://img.shields.io/npm/v/ckit.svg
[downloads-image]: http://img.shields.io/npm/dm/ckit.svg
[npm-url]: https://www.npmjs.org/package/ckit
[travis-image]: http://img.shields.io/travis/Bacra/node-ckit/master.svg?label=linux
[travis-url]: https://travis-ci.org/Bacra/node-ckit
[coveralls-image]: https://img.shields.io/coveralls/Bacra/node-ckit.svg
[coveralls-url]: https://coveralls.io/github/Bacra/node-ckit
[license-image]: http://img.shields.io/npm/l/ckit.svg
