# check-more-types v1.1.0

> Additional type checks for [check-types.js](https://github.com/philbooth/check-types.js)

[![NPM][check-more-types-icon] ][check-more-types-url]

[![Build status][check-more-types-ci-image] ][check-more-types-ci-url]
[![Coverage Status][check-more-types-coverage-image] ][check-more-types-coverage-url]
[![Codacy Badge][check-more-types-codacy-image] ][check-more-types-codacy-url]
[![Code Climate][check-more-types-code-climate-image] ][check-more-types-code-climate-url]
[![dependencies][check-more-types-dependencies-image] ][check-more-types-dependencies-url]
[![devdependencies][check-more-types-devdependencies-image] ][check-more-types-devdependencies-url]
![issue](http://issuestats.com/github/kensho/check-more-types/badge/issue)

[check-more-types-icon]: https://nodei.co/npm/check-more-types.png?downloads=true
[check-more-types-url]: https://npmjs.org/package/check-more-types
[check-more-types-ci-image]: https://travis-ci.org/kensho/check-more-types.png?branch=master
[check-more-types-ci-url]: https://travis-ci.org/kensho/check-more-types
[check-more-types-coverage-image]: https://coveralls.io/repos/kensho/check-more-types/badge.png
[check-more-types-coverage-url]: https://coveralls.io/r/kensho/check-more-types
[check-more-types-dependencies-image]: https://david-dm.org/kensho/check-more-types.png
[check-more-types-dependencies-url]: https://david-dm.org/kensho/check-more-types
[check-more-types-devdependencies-image]: https://david-dm.org/kensho/check-more-types/dev-status.png
[check-more-types-devdependencies-url]: https://david-dm.org/kensho/check-more-types#info=devDependencies
[check-more-types-codacy-image]: https://www.codacy.com/project/badge/25cb5d1410c7497cb057d887d1f3ea23
[check-more-types-codacy-url]: https://www.codacy.com/public/kensho/check-more-types.git
[check-more-types-code-climate-image]: https://codeclimate.com/github/kensho/check-more-types/badges/gpa.svg
[check-more-types-code-climate-url]: https://codeclimate.com/github/kensho/check-more-types



See [Readable conditions](http://bahmutov.calepin.co/readable-conditions-using-check-typesjs.html)
for advice and examples.

## Install

**node:** `npm install check-more-types --save`

    // instead of
    var check = require('check-types');
    // use this
    var check = require('check-more-types');
    console.assert(check.bit(1), 'check.bit works');

**browser** `bower install check-more-types --save`

    <script src="check-types.js"></script>
    <script src="check-more-types.js"></script>


* **API**
  * [check.bit](#checkbit)
  * [check.commitId](#checkcommitid)
  * [check.shortCommitId](#checkshortcommitid)
  * [check.index](#checkindex)
  * [check.same](#checksame)
  * [check.sameLength](#checksamelength)
  * [check.allSame](#checkallsame)
  * [check.unit](#checkunit)
  * [check.hexRgb](#checkhexrgb)
  * [check.bool](#checkbool)
  * [check.emptyString](#checkemptystring)
  * [check.empty](#checkempty)
  * [check.unempty](#checkunempty)
  * [check.unemptyArray](#checkunemptyarray)
  * [check.arrayOfStrings](#checkarrayofstrings)
  * [check.arrayOfArraysOfStrings](#checkarrayofarraysofstrings)
  * [check.lowerCase](#checklowercase)
  * [check.has(obj, property)](#checkhasobj-property)
  * [check.all](#checkall)
  * [check.schema](#checkschema)
  * [check.schema bind](#checkschema-bind)
  * [schema composition](#schema-composition)
  * [check.raises(fn, validator)](#checkraisesfn-validator)
* [Modifiers](#modifiers)
  * [check.maybe](#checkmaybe)
  * [check.not](#checknot)
  * [check.verify](#checkverify)
* [Adding your own predicates](#adding-your-own-predicates)
  * [check.mixin(predicate, name)](#checkmixinpredicate-name)
  * [check.mixin does not override](#checkmixin-does-not-override)
* [Defending a function](#defending-a-function)
  * [check.defend(fn, predicates)](#checkdefendfn-predicates)
  * [protects optional arguments](#protects-optional-arguments)
  * [check.defend with messages](#checkdefend-with-messages)
  * [check.defend in module pattern](#checkdefend-in-module-pattern)
* [Safe callback execution](#safe-callback-execution)
  * [check.then](#checkthen)


#### check.defined

    check.defined(0); // true
    check.defined(1); // true
    check.defined(true); // true
    check.defined(false); // true
    check.defined(null); // true
    check.defined(''); // true
    check.defined(); // false
    check.defined(root.doesNotExist); // false
    check.defined({}.doesNotExist); // false

---

#### check.bit

    check.bit(0); // true
    check.bit(1); // true
    check.bit('1'); // false
    check.bit(2); // false
    check.bit(true); // false

---

#### check.commitId

---

#### check.shortCommitId

---

#### check.index

---

#### check.same

    var foo = {},
      bar = {};
    check.same(foo, foo); // true
    check.same(foo, bar); // false
    // primitives are compared by value
    check.same(0, 0); // true
    check.same('foo', 'foo'); // true

`check.same` should produce same result as `===`.

---

#### check.sameLength

    check.sameLength([1, 2], ['a', 'b']); // true
    check.sameLength('ab', 'cd'); // true
    // different types
    check.sameLength([1, 2], 'ab'); // false

---

#### check.allSame

    var foo = {},
      bar = {};
    check.allSame([foo, foo, foo]); // true
    check.allSame([foo, foo, bar]); // false
    // primitives are compared by value
    check.allSame([0, 0]); // true
    check.allSame(['foo', 'foo', 'foo']); // true
    check.allSame([false, 0]); // false

---

#### check.unit

    check.unit(0); // true
    check.unit(1); // true
    check.unit(0.1); // true
    check.unit(1.2); // false
    check.unit(-0.1); // false

---

#### check.hexRgb

    check.hexRgb('#FF00FF'); // true
    check.hexRgb('#000'); // true
    check.hexRgb('#aaffed'); // true
    check.hexRgb('#00aaffed'); // false
    check.hexRgb('aaffed'); // false

---

#### check.bool

    check.bool(true); // true
    check.bool(false); // true
    check.bool(0); // false
    check.bool(1); // false
    check.bool('1'); // false
    check.bool(2); // false

---

#### check.emptyString

    check.emptyString(''); // true
    check.emptyString(' '); // false
    check.emptyString(0); // false
    check.emptyString([]); // false

---

#### check.empty

    check.empty([]); // true
    check.empty(''); // true
    check.empty({}); // true
    check.empty(0); // false
    check.empty(['foo']); // false

---

#### check.unempty

    check.unempty([]); // false
    check.unempty(''); // false
    check.unempty({}); // false
    check.unempty(0); // true
    check.unempty(['foo']); // true
    check.unempty('foo'); // true

---

#### check.unemptyArray

    check.unemptyArray(null); // false
    check.unemptyArray(1); // false
    check.unemptyArray({}); // false
    check.unemptyArray([]); // false
    check.unemptyArray(root.doesNotExist); // false
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

#### check.schema

    var obj = {
      foo: 'foo',
      bar: 'bar',
      baz: 'baz'
    };
    var schema = {
      foo: check.unemptyString,
      bar: function(value) {
        return value === 'bar';
      }
    };
    check.schema(schema, obj); // true
    check.schema(schema, {}); // false

`check.spec` is equivalent to `check.all` but with arguments reversed.
This makes it very convenient to create new validator functions using partial
argument application

#### check.schema bind

    var personSchema = {
      name: check.unemptyString,
      age: check.positiveNumber
    };
    var isValidPerson = check.schema.bind(null, personSchema);
    var h1 = {
      name: 'joe',
      age: 10
    };
    var h2 = {
      name: 'ann'
      // missing age property
    };
    isValidPerson(h1); // true
    isValidPerson(h2); // false

Because bound schema parameter generates a valid function, you can nest checks using
schema composition. For example let us combine the reuse `isValidPerson` as part of
another check

#### schema composition

    var teamSchema = {
      manager: isValidPerson,
      members: check.unemptyArray
    };
    var team = {
      manager: {
        name: 'jim',
        age: 20
      },
      members: ['joe', 'ann']
    };
    check.schema(teamSchema, team); // true

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
      check.instance(err, Error); // true
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

#### check.mixin(predicate, name)

    function isBar(a) {
      return a === 'bar';
    }
    check.mixin(isBar, 'bar');
    check.bar('bar'); // true
    check.bar('anything else'); // false
    // supports modifiers
    check.maybe.bar(); // true
    check.maybe.bar('bar'); // true
    check.not.bar('foo'); // true
    check.not.bar('bar'); // false

Mixin will not override existing functions

#### check.mixin does not override

    function isFoo(a) {
      return a === 'foo';
    }

    function isBar(a) {
      return a === 'bar';
    }
    check.mixin(isFoo, 'isFoo');
    check.isFoo; // isFoo
    check.mixin(isBar, 'isFoo');
    check.isFoo; // isFoo

### Defending a function

Using *check-more-types* you can separate the inner function logic from checking input
arguments. Instead of this

```js
function add(a, b) {
    la(check.number(a), 'first argument should be a number', a);
    la(check.number(a), 'second argument should be a number', b);
    return a + b;
}
```

you can use `check.defend` function

#### check.defend(fn, predicates)

    function add(a, b) {
      return a + b;
    }
    var safeAdd = check.defend(add, check.number, check.number);
    add('foo', 2); // 'foo2'
    // calling safeAdd('foo', 2) raises an exception
    check.raises(safeAdd.bind(null, 'foo', 2)); // true

---

#### protects optional arguments

    function add(a, b) {
      if (typeof b === 'undefined') {
        return 'foo';
      }
      return a + b;
    }
    add(2); // 'foo'
    var safeAdd = check.defend(add, check.number, check.maybe.number);
    safeAdd(2, 3); // 5
    safeAdd(2); // 'foo'

---

You can add extra message after a predicate

#### check.defend with messages

    function add(a, b) {
      return a + b;
    }
    var safeAdd = check.defend(add, check.number, 'a should be a number', check.string, 'b should be a string');
    safeAdd(2, 'foo'); // '2foo'
    function addNumbers() {
      return safeAdd(2, 3);
    }

    function checkException(err) {
      err.message; // 'Argument 2: 3 does not pass predicate: b should be a string'
      return true;
    }
    check.raises(addNumbers, checkException); // true

---

This works great when combined with JavaScript module pattern as in this example

#### check.defend in module pattern

    var add = (function() {
      // inner private function without any argument checks
      function add(a, b) {
        return a + b;
      }
      // return defended function
      return check.defend(add, check.number, check.number);
    }());
    add(2, 3); // 5
    // trying to call with non-numbers raises an exception
    function callAddWithNonNumbers() {
      return add('foo', 'bar');
    }
    check.raises(callAddWithNonNumbers); // true

---

### Safe callback execution

Sometimes we want to execute a function depending on the condition, but without throwing an
exception. For these cases, there is `check.then`

#### check.then

    function isSum10(a, b) {
      return a + b === 10;
    }

    function sum(a, b) {
      return a + b;
    }
    var onlyAddTo10 = check.then(isSum10, sum);
    // isSum10 returns true for these arguments
    // then sum is executed
    onlyAddTo10(3, 7); // 10
    onlyAddTo10(1, 2); // undefined
    // sum is never called because isSum10 condition is false

----

### Small print

Author: Kensho &copy; 2014

* [@kensho](https://twitter.com/kensho)
* [kensho.com](http://kensho.com)

Support: if you find any problems with this library,
[open issue](https://github.com/kensho/check-more-types/issues) on Github



This documentation was generated using [grunt-xplain](https://github.com/bahmutov/grunt-xplain)
and [grunt-readme](https://github.com/jonschlinkert/grunt-readme).

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



