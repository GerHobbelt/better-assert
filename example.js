
var assert = require('./');


function test() {
  var user = { name: 'tobi' };
  assert('tobi' == user.name);
  assert('number' == typeof user.age);
}

try {
	test();
} catch (ex) {
	console.log("## Demo ##\n");
	console.log(ex);

	// tests which serve as simple better-assert library unit tests:
	console.log("\n\n==================================\n\n## Unit Tests for the library ##\n\n");
	
	assert(ex.message.indexOf("'number' == typeof user.age") >= 0);
	assert(ex.name.indexOf("AssertionError") === 0);

	console.log("PASS OK");
}