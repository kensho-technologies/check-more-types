# {%= name %} v{%= version %}

> Additional type checks for [check-types.js](https://github.com/philbooth/check-types.js)

{%= _.doc("./docs/badges.md") %}

{%= toc %}

## Install

**node:** `npm install {%= name %} --save`

    global.check = require('check-types');
    require('{%= name %}');
    // patches global check object

**browser** `bower install {%= name %} --save`

    <script src="check-types.js"></script>
    <script src="{%= name %}.js"></script>

See [Readable conditions](http://bahmutov.calepin.co/readable-conditions-using-check-typesjs.html)
for examples.

## API

{%= _.doc("./docs/use.md") %}

{%= _.doc("./docs/footer.md") %}

## MIT License

{%= _.doc("./LICENSE") %}

