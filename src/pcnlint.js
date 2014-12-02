(function(){
	"use strict";

	// Load PCN document from parameter
	var fs		= require('fs'),
		stdin 	= require('get-stdin'),
		chai	= require('chai'),
		expect	= chai.expect;

	function noDecimals(v) {
		return v % 1 === 0.0;
	}

	function stringMatch(stringValues) {
		return function(testValue) {
			for (var i = stringValues.length - 1; i >= 0; i--) {
				if (stringValues[i] === testValue) {
					return true;
				}
			}
			return false;
		};
	}

	function domainExists(domains) {
		// Verify the domain assigned exists
		return function(domainId) {
			for (var i = domains.length - 1; i >= 0; i--) {
				if (domainId === domains[i].id) {
					return true;
				}
			}
			return false;
		};
	}

	function stepExists(steps) {
		return function(stepId) {
			// Verify the step exists
			for (var i = steps.length - 1; i >= 0; i--) {
				if (stepId === steps[i].id) {
					return true;
				}
			}
			return false;
		};
	}

	function testDocument(docData) {
		// Document must be valid JSON
		expect(function() { JSON.parse(docData); }).to.not.throw(Error);
		var doc = JSON.parse(docData);

		// Metadata must be object
		expect(doc).to.have.property('metadata')
		.that.is.an('object', 'The metadata property must be an object');

		// Domains is array
		expect(doc).to.have.property('domains')
		.that.is.an('array', 'The domains property must be an array');

		// Steps is array of at least 2 objects
		expect(doc).to.have.property('steps')
		.that.is.an('array', 'The steps property must be an array');

		// Domain Validation
		for (var d = doc.domains.length - 1; d >= 0; d--) {
			/**
			1. id is string
			2. id is unique
			3. title is string
			4. subtitle is string
			**/
			expect(doc.domains[d]).to.be.an('object', 'Each domain must be an object; domain ' + d + ' is not an object');

			expect(doc.domains[d]).to.have.property('id')
			.that.is.a('string', 'Domain ' + d + ' id must be a string');

			expect(doc.domains[d]).to.have.property('title')
			.that.is.a('string', 'Domain ' + d + ' title must be a string');

			expect(doc.domains[d]).to.have.property('subtitle')
			.that.is.a('string', 'Domain ' + d + ' title must be a string');
		}

		// Steps validation
		for (var s = doc.steps.length -1; s >= 0; s--) {
			var step = doc.steps[s];

			expect(step).to.be.an('object');

			expect(step).to.have.property('id')
			.that.is.a('string');

			expect(step).to.have.property('title')
			.that.is.a('string');

			expect(step).to.have.property('type')
			.that.is.a('string')
			.and.to.satisfy(stringMatch(['process', 'decision', 'divergent_process', 'wait']));

			if (step.emphasized) {
				expect(step).to.have.property('emphasized')
				.that.is.a('boolean');
			}

			if (step.value_specific) {
				expect(step).to.have.property('value_specific')
				.that.is.a('Number')
				.and.to.satisfy(noDecimals);
			}

			if (step.value_generic) {
				expect(step).to.have.property('value_generic')
				.that.is.a('Number')
				.and.to.satisfy(noDecimals);
			}

			if (step.predecessors) {
				expect(step).to.have.property('predecessors')
				.that.is.an('array');

				for (var p = step.predecessors.length - 1; p >= 0; p--) {
					var pred = step.predecessors[p];

					expect(pred).to.have.property('id')
					.that.is.a('string')
					.and.to.satisfy(stepExists(doc.steps));

					expect(pred).to.have.property('type')
					.that.is.a('string')
					.and.to.satisfy(stringMatch(['normal_relationship', 'loose_temporal_relationship']));

					if (pred.title) {
						expect(pred).to.have.property('title')
						.that.is.a('string');
					}
				}
			}

			expect(step).to.have.property('domain')
			.that.is.an('object');

			var domain = step.domain;

			expect(domain).to.have.property('id')
			.that.is.a('string')
			.and.to.satisfy(domainExists(doc.domains));

			expect(domain).to.have.property('region')
			.that.is.an('object');

			expect(domain.region).to.have.property('type')
			.that.is.a('string')
			.and.to.satisfy(stringMatch(['independent', 'surrogate', 'direct_leading', 'direct_shared']));

			if (domain.region.type !== 'independent') {
				expect(domain.region).to.have.property('with_domain')
				.that.is.a('string')
				.and.to.satisfy(domainExists);
			}

			if (step.problems) {
				expect(step).to.have.property('problems')
				.that.is.an('array');

				for (var pr = step.problems.length - 1; pr >= 0; pr--) {
					expect(step.problems[pr]).to.be.an('object');

					expect(step.problems[pr]).to.have.property('type')
					.that.is.a('string')
					.and.to.satisfy(stringMatch(['inconvenient', 'confusing', 'difficult', 'likely_to_fail']));

					expect(step.problems[pr]).to.have.property('description')
					.that.is.a('string');
				}
			}
		}
	}

	function interpret(rawArgs) {
		// Determine if we're using stdin or files
		var argv = require('minimist')(rawArgs.slice(2));

		// File-based input
		if (argv._.length > 0) {
			for (var i = argv._.length - 1; i >= 0; i--) {
				var data = fs.readFileSync(argv._[i], 'utf8');
				testDocument(data);
			}
		} else { // Attempt to use STDIN
			stdin(function(data) {
				testDocument(data);
			});
		}
	}

	var exports = {
		"testDocument": testDocument,
		"interpret": interpret
	};

	module.exports = exports;
})();