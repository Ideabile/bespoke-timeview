[![Build Status](https://secure.travis-ci.org/M3kH/bespoke-timeview.png?branch=master)](https://travis-ci.org/M3kH/bespoke-timeview) [![Coverage Status](https://coveralls.io/repos/M3kH/bespoke-timeview/badge.png)](https://coveralls.io/r/M3kH/bespoke-timeview)

# bespoke-timeview

Time line feature for bespoke

## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/M3kH/bespoke-timeview/master/dist/bespoke-timeview.min.js
[max]: https://raw.github.com/M3kH/bespoke-timeview/master/dist/bespoke-timeview.js

## Usage

This plugin is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
var bespoke = require('bespoke'),
  timeview = require('bespoke-timeview');

bespoke.from('#presentation', [
  timeview()
]);
```

When using browser globals:

```js
bespoke.from('#presentation', [
  bespoke.plugins.timeview()
]);
```

## Package managers

### npm

```bash
$ npm install bespoke-timeview
```

### Bower

```bash
$ bower install bespoke-timeview
```

## Credits

This plugin was built with [generator-bespokeplugin](https://github.com/markdalgleish/generator-bespokeplugin).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
