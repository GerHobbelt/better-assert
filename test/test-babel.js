// run with babel-node
//   install:
//     * npm install --save-dev babel-core
//     * npm install --save-dev babel-preset-es2015
//     * npm install -g babel
//       babel-node --presets es2015 ./test/test-babel.hs
//
// should display:
// throw err;
// ^
// AssertionError: 1==2,"1 should be 2"
//
// at myFunction (/projects/better-assert/test/test-babel.js:23:5)
// at Object.<anonymous> /projects/better-assert/test/test-babel.js:20:1)
// at Module._compile (module.js:570:32)
//...

import assert from "..";



function myFunction() {
    assert(1==2,"1 should be 2");
}

try {
	myFunction();
} catch (ex) {
	console.log("## Demo ##\n");
	console.log(ex);

	// tests which serve as simple better-assert library unit tests:
	console.log("\n\n==================================\n\n## Unit Tests for the library ##\n\n");
	
	assert(ex.message.indexOf("(1 == 2) 1 should be 2") >= 0);
	assert(ex.name.indexOf("AssertionError") === 0);

	console.log("PASS OK");
}
