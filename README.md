# check-more-types v0.6.2

> Additional type checks for [check-types.js](https://github.com/philbooth/check-types.js)

[![NPM][check-more-types-icon] ][check-more-types-url]

[![Build status][check-more-types-ci-image] ][check-more-types-ci-url]
[![dependencies][check-more-types-dependencies-image] ][check-more-types-dependencies-url]
[![devdependencies][check-more-types-devdependencies-image] ][check-more-types-devdependencies-url]

[check-more-types-icon]: https://nodei.co/npm/check-more-types.png?downloads=true
[check-more-types-url]: https://npmjs.org/package/check-more-types
[check-more-types-ci-image]: https://travis-ci.org/kensho/check-more-types.png?branch=master
[check-more-types-ci-url]: https://travis-ci.org/kensho/check-more-types
[check-more-types-dependencies-image]: https://david-dm.org/kensho/check-more-types.png
[check-more-types-dependencies-url]: https://david-dm.org/kensho/check-more-types
[check-more-types-devdependencies-image]: https://david-dm.org/kensho/check-more-types/dev-status.png
[check-more-types-devdependencies-url]: https://david-dm.org/kensho/check-more-types#info=devDependencies



### Install

**node:** `npm install check-more-types --save`

    global.check = requier('check-types');
    require('check-more-types');
    // patches global check object

**browser** `bower install check-more-types --save`

    <script src="check-types.js"></script>
    <script src="check-more-types.js"></script>

## API

#### check.defined

    check.defined(0); // true
    check.defined(1); // true
    check.defined(true); // true
    check.defined(false); // true
    check.defined(null); // true
    check.defined(''); // true
    check.defined(); // false
    check.defined(root.does_not_exist); // false
    check.defined({}.does_not_exist); // false

---

#### check.bit

    check.bit(0); // true
    check.bit(1); // true
    check.bit('1'); // false
    check.bit(2); // false
    check.bit(true); // false

---

#### check.bool

    check.bool(true); // true
    check.bool(false); // true
    check.bool(0); // false
    check.bool(1); // false
    check.bool('1'); // false
    check.bool(2); // false

---

#### check.unemptyArray

    check.unemptyArray(null); // false
    check.unemptyArray(1); // false
    check.unemptyArray({}); // false
    check.unemptyArray([]); // false
    check.unemptyArray(root.does_not_exist); // false
    check.unemptyArray([1]); // true
    check.unemptyArray(['foo', 'bar']); // true

---

#### check.arrayOfStrings

    // second argument is checkLowerCase
    check.arrayOfStrings(['foo', 'Foo']); // true
    check.arrayOfStrings(['foo', 'Foo'], true); // false
    check.arrayOfStrings(['foo', 'bar'], true); // true
    check.arrayOfStrings(['FOO', 'BAR'], true); // false

---

#### check.arrayOfArraysOfStrings

    // second argument is checkLowerCase
    check.arrayOfArraysOfStrings([['foo'], ['bar'}}); // true
    check.arrayOfArraysOfStrings([['foo'], ['bar'}}, true); // true
    check.arrayOfArraysOfStrings([['foo'], ['BAR'}}, true); // false

---

#### check.lowerCase

    check.lowerCase('foo bar'); // true
    check.lowerCase('*foo ^bar'); // true
    check.lowerCase('fooBar'); // false
    // non-strings return false
    check.lowerCase(10); // false

---

#### check.has(obj, property)

    var obj = {
    foo: 'foo',
    bar: 0
    };
    check.has(obj, 'foo'); // true
    check.has(obj, 'bar'); // true
    check.has(obj, 'baz'); // false
    // non-object returns false
    check.has(5, 'foo'); // false
    check.has('foo', 'length'); // true

---

#### check.all

    var obj = {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz'
    };
    var predicates = {
    foo: check.unemptyString,
    bar: function(value) {
    return value === 'bar';
    }
    };
    check.all(obj, predicates); // true

---

#### check.raises(fn, validator)

    function foo() {
    throw new Error('foo');
    }

    function bar() {}

    function isValidError(err) {
    return err.message === 'foo';
    }

    function isInvalid(err) {
    return false;
    }
    check.raises(foo); // true
    check.raises(bar); // false
    check.raises(foo, isValidError); // true
    check.raises(foo, isInvalid); // false

### Modifiers

Every predicate function is also added to `check.maybe` object.
The `maybe` predicate passes if the argument is null or undefined,
or the predicate returns true.

#### check.maybe

    check.maybe.bool(); // true
    check.maybe.bool('true'); // false
    var empty;
    check.maybe.lowerCase(empty); // true
    check.maybe.unemptyArray(); // true
    check.maybe.unemptyArray([]); // false
    check.maybe.unemptyArray(['foo', 'bar']); // true

Every function has a negated predicate in `check.not` object

#### check.not

    check.not.bool(4); // true
    check.not.bool('true'); // true
    check.not.bool(true); // false

Every predicate can also throw an exception if it fails

#### check.verify

    check.verify.arrayOfStrings(['foo', 'bar']);
    check.verify.bit(1);

    function nonStrings() {
    check.verify.arrayOfStrings(['Foo', 1]);
    }
    check.raises(nonStrings); // true
    function nonLowerCase() {
    check.verify.lowerCase('Foo');
    }
    check.raises(nonLowerCase); // true

---

### Adding your own predicates

You can add new predicates to `check`, `check.maybe`, etc. by using `check.mixin(predicate)`
method

#### check.mixin(predicate)

    check.foo; // false
    // new predicate to be added. Should have function name
    function foo(a) {
    return a === 'foo';
    }
    check.mixin(foo);
    check.fn(check.foo); // true
    check.fn(check.maybe.foo); // true
    check.fn(check.not.foo); // true
    check.foo('foo'); // true
    check.maybe.foo('foo'); // true
    check.not.foo('bar'); // true
    // you can provide name
    function isBar(a) {
    return a === 'bar';
    }
    check.mixin(isBar, 'bar');
    check.bar('bar'); // true
    check.bar('anything else'); // false
    // does NOT overwrite predicate if already exists
    check.bar; // isBar
    check.mixin(foo, 'bar');
    check.bar; // isBar


### Small print

Author: Kensho &copy; 2014

* [@kensho](https://twitter.com/kensho)
* [kensho.com](http://kensho.com)

Support: if you find any problems with this library,
[open issue](https://github.com/kensho/check-more-types/issues) on Github



## MIT License

The MIT License (MIT)

Copyright (c) 2014 Kensho

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



