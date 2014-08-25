# API

### check.unemptyArray

    check.unemptyArray(null); // false
    check.unemptyArray(1); // false
    check.unemptyArray({}); // false
    check.unemptyArray([]); // false
    check.unemptyArray(root.does_not_exist); // false
    check.unemptyArray([1]); // true
    check.unemptyArray(['foo', 'bar']); // true