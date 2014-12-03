(function(){
	"use strict";

	// Load PCN document from parameter
	var fs			= require('fs'),
		stdin 		= require('get-stdin'),
		Mocha		= require('mocha');

	/**
	 * Test a document string, optionally providing parameters to mocha
	 */
	function testDocument(docData, mochaOpts) {
		var mocha = new Mocha(mochaOpts);

		// Store data in environment variable
		process.env.pcnlint_testcase = docData;

		mocha.addFile('./src/mocha.js');

		mocha.run(function(failures){
			process.on('exit', function () {
				process.exit(failures);
			});
		});
	}

	/**
	 * Command-line runner, taking the process.argv parameter (or equivalent)
	 */
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
		} else { // Attempt to use STDIN
			stdin(function(data) {
				testDocument(data, mochaOpts);
			});
		}
	}

	var exports = {
		"testDocument": testDocument,
		"interpret": interpret
	};

	module.exports = exports;
})();