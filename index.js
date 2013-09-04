/**
 * Module dependencies.
 */

var AssertionError = require('assert').AssertionError
  , callsite = require('callsite')
  , fs = require('fs')

/**
 * Expose `assert`.
 */

module.exports = process.env.NO_ASSERT
  ? function(){}
  : assert;

/**
 * Assert the given `expr`.
 */

function assert(expr, msg) {
  if (expr) return;

  var stack = callsite();
  var call = stack[1];
  var file = call.getFileName();
  var lineno = call.getLineNumber();
  var src = fs.readFileSync(file, 'utf8');
  var line = src.split('\n')[lineno-1];
  var src = line.match(/assert\((.*)\)/)[1];
  var custom = (msg !== undefined) ? msg : '';

  if (custom){
      src = src.replace(/,.*$/, '');
  }

  var err = new AssertionError({
    message: '(' + src + ') ' + custom,
    stackStartFunction: stack[0].fun
  });

  throw err;
}

