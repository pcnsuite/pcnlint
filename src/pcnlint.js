(function(){
	"use strict";

	// Load PCN document from parameter
	var fs			= require('fs'),
		stdin 		= require('get-stdin'),
		chai		= require('chai'),
		expect		= chai.expect,
		Mocha		= require('mocha');

	function testDocument(docData, mochaOpts) {
		var mocha = new Mocha(mochaOpts);

		// Write data to temporary file
		fs.writeFileSync('testcase.json', docData);

		mocha.addFile('./src/mocha.js');

		mocha.run(function(failures){
			process.on('exit', function () {
				process.exit(failures);
			});
		});
	}

	function cleanup() {
		fs.unlinkSync('testcase.json');
	}

	function interpret(rawArgs) {
		// Determine if we're using stdin or files
		var argv = require('minimist')(rawArgs.slice(2));

		// Construct mocha arguments
		// XXXX accept other mocha opts
		var mochaOpts = {
			// grep: '',
			// ui: '',
			// timeout: '',
			// bail: '',
			reporter: argv.R || argv.reporter
		};

		// File-based input
		if (argv._.length > 0) {
			for (var i = argv._.length - 1; i >= 0; i--) {
				var data = fs.readFileSync(argv._[i], 'utf8');
				testDocument(data, mochaOpts);
			}
			cleanup();
		} else { // Attempt to use STDIN
			stdin(function(data) {
				testDocument(data, mochaOpts);
				cleanup();
			});
		}
	}

	var exports = {
		"testDocument": testDocument,
		"interpret": interpret
	};

	module.exports = exports;
})();