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

---

### check.has

---

### check.all

---