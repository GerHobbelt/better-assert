// node test/test.js
const assert = require("..");

var a = 1;
var b = 2;

function myFunction() {
    assert(a==b,`${a} should be ${b}`);
}

try {
	myFunction();
} catch (ex) {
	console.log("## Demo ##\n");
	console.log(ex);

	// tests which serve as simple better-assert library unit tests:
	console.log("\n\n==================================\n\n## Unit Tests for the library ##\n\n");

	assert(
		// this check will match when run directly in node (v8, v10, ...)	
		ex.message.indexOf("(a==b,`${a} should be ${b}`) 1 should be 2") >= 0 ||
		// while this check will match when run via a babel transpile (which prettyfies the code)	
		ex.message.indexOf("(a == b, `${a} should be ${b}`) 1 should be 2") >= 0);
	assert(ex.name.indexOf("AssertionError") === 0);

	console.log("PASS OK");
}
