/**
 * Module dependencies.
 */

var AssertionError = require('assert').AssertionError
  // , callsite = require('callsite')
  , fs = require('fs')
  , path = require('path');

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

  var a = new Error();
  // 0 => Error
  // 1 => at assert
  // 2 =>  at Object.<anonymous> (/project/myproject/test/test-babel.js:15:1)', <= where the assert was raised !
  // .....
  //
  var errorline = a.stack.split('\n')[2];
  var m = errorline.match(/at (.*)\((.*):([0-9]*):([0-9]*)\)/);
  var func = m[1]; // Object.<anonymous> (not very useful)
  var file = m[2]; // filename
  var lineno = parseInt(m[3]);
  var src = getAssertMessage(file, lineno);
  var custom = (msg != null) ? msg : '';

  if (custom) {
    // strip off the last (custom message) argument: we expect it to be a literal string!
    src = src.replace(/,\s*['"].*$/, '');
    src = '(' + src + ') ' + custom;
  }

  var err = new AssertionError({
    message: src,
    stackStartFunction: assert
  });

  throw err;
}

/**
 * Finds the assert expression in `file` on line `lineno`.
 */

function getAssertMessage(file, lineno) {
  var ext = path.extname(file)
    , line = null;

  switch (ext) {
    case '.coffee':
    case '.litcoffee':
      line = readCoffeeLine(file, lineno);
      break;
    default:
      line = readJsLine(file, lineno);
      break;
  }

  var m = line.match(/assert\((.*)\)/);
  if (!m) {
    // however, if the entire file doesn't carry any assert() lines any more,
    // our next bet is this source file was transpiled by babel:
    m = line.match(/\(0, [\w_]+\.default\)\((.*)\)/);
  }

  return m ? m[1] : "???";
}

/**
 * Reads line `lineno` from the file at `file`.
 */

function readJsLine(file, lineno) {
  var src = fs.readFileSync(file, 'utf8');
  return src.split('\n')[lineno-1];
}

/**
 * Reads the line at `lineno` in the result from compiling
 * the coffee file at `file`.
 */

function readCoffeeLine(file, lineno) {
  var coffee = require('coffee-script');
  var raw = fs.readFileSync(file, 'utf8');
  var noBom = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
  var options = { filename: file };

  if (coffee.helpers.isLiterate) {
    options.literate = coffee.helpers.isLiterate(file);
  }

  var src = coffee.compile(noBom, options);
  return src.split('\n')[lineno-1];
}
