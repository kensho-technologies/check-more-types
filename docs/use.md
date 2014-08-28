# API

### check.defined

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

### check.bit

    check.bit(0); // true
    check.bit(1); // true
    check.bit('1'); // false
    check.bit(2); // false
    check.bit(true); // false

---

### check.bool

    check.bool(true); // true
    check.bool(false); // true
    check.bool(0); // false
    check.bool(1); // false
    check.bool('1'); // false
    check.bool(2); // false

---

### check.unemptyArray

    check.unemptyArray(null); // false
    check.unemptyArray(1); // false
    check.unemptyArray({}); // false
    check.unemptyArray([]); // false
    check.unemptyArray(root.does_not_exist); // false
    check.unemptyArray([1]); // true
    check.unemptyArray(['foo', 'bar']); // true

---

### check.arrayOfStrings

    // second argument is checkLowerCase
    check.arrayOfStrings(['foo', 'Foo']); // true
    check.arrayOfStrings(['foo', 'Foo'], true); // false
    check.arrayOfStrings(['foo', 'bar'], true); // true
    check.arrayOfStrings(['FOO', 'BAR'], true); // false

---

### check.arrayOfArraysOfStrings

    // second argument is checkLowerCase
    check.arrayOfArraysOfStrings([['foo'], ['bar']]); // true
    check.arrayOfArraysOfStrings([['foo'], ['bar']], true); // true
    check.arrayOfArraysOfStrings([['foo'], ['BAR']], true); // false

---

### check.lowerCase

    check.lowerCase('foo bar'); // true
    check.lowerCase('*foo ^bar'); // true
    check.lowerCase('fooBar'); // false
    // non-strings return false
    check.lowerCase(10); // false

---

### check.has(obj, property)

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

### check.all

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

### check.raises(fn, validator)

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

## Modifiers

Every predicate function is also added to `check.maybe` object.
The `maybe` predicate passes if the argument is null or undefined,
or the predicate returns true.

### check.maybe

    check.maybe.bool(); // true
    check.maybe.bool('true'); // false
    var empty;
    check.maybe.lowerCase(empty); // true
    check.maybe.unemptyArray(); // true
    check.maybe.unemptyArray([]); // false
    check.maybe.unemptyArray(['foo', 'bar']); // true

Every function has a negated predicate in `check.not` object

### check.not

    check.not.bool(4); // true
    check.not.bool('true'); // true
    check.not.bool(true); // false

Every predicate can also throw an exception if it fails

### check.verify

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

## Adding your own predicates

You can add new predicates to `check`, `check.maybe`, etc. by using `check.mixin(predicate)`
method

### check.mixin(predicate)

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